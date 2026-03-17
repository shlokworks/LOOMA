const fs = require('fs-extra');
const path = require('path');
const { exec, spawn } = require('child_process');
const net = require('net'); // ✅ ADD FOR PORT CHECKING

class ReactProjectRunner {
  constructor() {
    this.projects = new Map(); // projectId -> { port, process, path, url }
    this.basePort = 5174;
    this.projectsDir = path.join(process.cwd(), 'temp-projects');
    
    // Ensure temp directory exists
    fs.ensureDirSync(this.projectsDir);
  }

  // ✅ ADD: Find available port method
  async findAvailablePort(startPort = 5174) {
    const isPortAvailable = (port) => {
      return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(port, () => {
          server.close();
          resolve(true);
        });
        server.on('error', () => {
          resolve(false);
        });
      });
    };

    for (let port = startPort; port < startPort + 20; port++) {
      if (await isPortAvailable(port)) {
        return port;
      }
    }
    throw new Error('No available ports found');
  }

  // 🛠️ FIXED: Only strip project prefixes, preserve src/ folder
  fixPackageJson(files) {
    const fixedFiles = { ...files };
    
    // 🛠️ FIX: Only strip project directory prefixes, keep src/ intact
    const cleanedFiles = {};
    for (const [filePath, content] of Object.entries(fixedFiles)) {
      let cleanPath = filePath;
      
      // Only remove project folder prefixes like "shopping-cart/", "react-shopping-cart/"
      // BUT preserve "src/" folder structure
      if (filePath.startsWith('shopping-cart/') || filePath.startsWith('react-shopping-cart/')) {
        cleanPath = filePath.replace(/^(shopping-cart|react-shopping-cart)\//, '');
      }
      
      cleanedFiles[cleanPath] = content;
    }
    
    // Check if package.json exists and fix it
    if (cleanedFiles['package.json']) {
      try {
        const pkg = JSON.parse(cleanedFiles['package.json']);
        console.log('🔍 Current package.json scripts:', pkg.scripts);
        
        // Fix if scripts are wrong
        if (!pkg.scripts || pkg.scripts.dev?.includes('nodemon') || pkg.scripts.dev?.includes('server.js')) {
          console.log('🛠️ Fixing package.json scripts...');
          pkg.name = "react-app";
          pkg.private = true;
          pkg.version = "1.0.0";
          pkg.type = "module";
          pkg.scripts = {
            "dev": "vite",
            "build": "vite build", 
            "preview": "vite preview"
          };
          pkg.dependencies = {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            ...pkg.dependencies
          };
          pkg.devDependencies = {
            "@vitejs/plugin-react": "^4.0.0",
            "vite": "^4.4.0",
            ...pkg.devDependencies
          };
          
          cleanedFiles['package.json'] = JSON.stringify(pkg, null, 2);
          console.log('✅ Fixed package.json');
        }
      } catch (e) {
        console.error('❌ Error parsing package.json:', e);
        cleanedFiles['package.json'] = JSON.stringify({
          "name": "react-app",
          "private": true,
          "version": "1.0.0",
          "type": "module",
          "scripts": {
            "dev": "vite",
            "build": "vite build",
            "preview": "vite preview"
          },
          "dependencies": {
            "react": "^18.2.0",
            "react-dom": "^18.2.0"
          },
          "devDependencies": {
            "@vitejs/plugin-react": "^4.0.0",
            "vite": "^4.4.0"
          }
        }, null, 2);
      }
    } else {
      console.log('📝 Creating missing package.json...');
      cleanedFiles['package.json'] = JSON.stringify({
        "name": "react-app",
        "private": true,
        "version": "1.0.0",
        "type": "module",
        "scripts": {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview"
        },
        "dependencies": {
          "react": "^18.2.0",
          "react-dom": "^18.2.0"
        },
        "devDependencies": {
          "@vitejs/plugin-react": "^4.0.0",
          "vite": "^4.4.0"
        }
      }, null, 2);
    }
    
    return cleanedFiles;
  }

  async createAndRunProject(files, projectName) {
    const projectId = `${projectName}-${Date.now()}`;
    const projectPath = path.join(this.projectsDir, projectId);
    
    // ✅ USE NEW PORT FINDER instead of simple increment
    const port = await this.findAvailablePort(this.basePort);

    try {
      console.log(`📁 Creating project: ${projectId} at ${projectPath} on port ${port}`);
      
      // Create project directory
      await fs.ensureDir(projectPath);
      
      // 🛠️ APPLY PACKAGE.JSON FIX BEFORE WRITING FILES
      const fixedFiles = this.fixPackageJson(files);
      
      // Write all files - 🛠️ FIXED: Handle empty folders properly
      for (const [filePath, content] of Object.entries(fixedFiles)) {
        // 🛠️ FIX: Only remove project prefixes, preserve src/ folder
        let cleanPath = filePath;
        
        // Only strip project folder prefixes, keep src/ intact
        if (filePath.startsWith('shopping-cart/') || filePath.startsWith('react-shopping-cart/')) {
          cleanPath = filePath.replace(/^(shopping-cart|react-shopping-cart)\//, '');
        }
        
        const fullPath = path.join(projectPath, cleanPath);
        
        // ✅ CRITICAL FIX: Skip empty folders (paths ending with / and empty content)
        if ((filePath.endsWith('/') && (!content || content.trim() === '')) || 
            (!content || content.trim() === '')) {
          console.log(`⏭️  Skipping empty folder: ${cleanPath}`);
          continue;
        }
        
        await fs.ensureDir(path.dirname(fullPath));
        await fs.writeFile(fullPath, content);
        console.log(`📄 Created: ${cleanPath}`);
      }

      // Check if package.json exists and has dependencies
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
        
        if (packageJson.dependencies || packageJson.devDependencies) {
          console.log('📦 Installing dependencies...');
          await this.installDependencies(projectPath);
        }
      }

      // Start Vite dev server
      console.log(`🚀 Starting dev server on port ${port}...`);
      const viteProcess = spawn('npm', ['run', 'dev'], {
        cwd: projectPath,
        env: { ...process.env, PORT: port.toString(), BROWSER: 'none' },
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let serverStarted = false;
      let serverOutput = '';
      
      // Capture output to detect when server is ready
      viteProcess.stdout.on('data', (data) => {
        const output = data.toString();
        serverOutput += output;
        console.log(`[${projectId}]: ${output}`);
        
        if (output.includes('Local:') || output.includes('ready in') || output.includes('http://localhost:')) {
          serverStarted = true;
        }
      });

      viteProcess.stderr.on('data', (data) => {
        const errorOutput = data.toString();
        console.error(`[${projectId} ERROR]: ${errorOutput}`);
        serverOutput += `ERROR: ${errorOutput}`;
      });

      viteProcess.on('error', (error) => {
        console.error(`[${projectId} PROCESS ERROR]: ${error.message}`);
      });

      viteProcess.on('close', (code) => {
        console.log(`[${projectId}]: Process exited with code ${code}`);
        this.projects.delete(projectId);
      });

      this.projects.set(projectId, { 
        path: projectPath, 
        port, 
        process: viteProcess,
        url: `http://localhost:${port}`
      });

      // Wait for server to start (max 15 seconds)
      for (let i = 0; i < 30; i++) {
        if (serverStarted) break;
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (!serverStarted) {
        console.warn('⚠️ Server might not be fully ready, but returning URL anyway');
        console.log('📋 Server output:', serverOutput);
      }

      return { 
        success: true, 
        url: `http://localhost:${port}`,
        projectId 
      };

    } catch (error) {
      console.error('❌ Failed to run project:', error);
      await fs.remove(projectPath).catch(console.error);
      return { success: false, error: error.message };
    }
  }

  async installDependencies(projectPath) {
    return new Promise((resolve, reject) => {
      const installProcess = spawn('npm', ['install'], {
        cwd: projectPath,
        stdio: 'inherit'
      });

      installProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Dependencies installed successfully');
          resolve();
        } else {
          reject(new Error(`npm install failed with code ${code}`));
        }
      });

      installProcess.on('error', reject);
    });
  }

  stopProject(projectId) {
    const project = this.projects.get(projectId);
    if (project) {
      console.log(`🛑 Stopping project: ${projectId}`);
      project.process.kill();
      fs.remove(project.path).catch(console.error);
      this.projects.delete(projectId);
    }
  }

  cleanup() {
    console.log('🧹 Cleaning up all projects...');
    for (const [projectId, project] of this.projects) {
      console.log(`🛑 Stopping project: ${projectId}`);
      project.process.kill();
      fs.remove(project.path).catch(console.error);
    }
    this.projects.clear();
  }
}

module.exports = new ReactProjectRunner();