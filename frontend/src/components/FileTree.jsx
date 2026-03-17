// components/FileTree.jsx
import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/useProjectStore';

const FileItem = ({ name, item, level = 0, activePath, onSelect, onRename, onDelete, onNewFile, onNewFolder }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(name);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  const isFile = item.type === 'file';
  const isActive = activePath === item.path;

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleRename = () => {
    setIsRenaming(true);
    setShowContextMenu(false);
  };

  const handleRenameConfirm = () => {
    if (newName.trim() && newName !== name) {
      onRename(item.path, newName);
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setNewName(name);
    setIsRenaming(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleRenameConfirm();
    if (e.key === 'Escape') handleRenameCancel();
  };

  const paddingLeft = `${level * 16 + 8}px`;

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowContextMenu(false);
    };
    
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu]);

  if (isFile) {
    return (
      <div
        onClick={() => onSelect(item.path)}
        onContextMenu={handleContextMenu}
        className={`flex items-center gap-2 px-2 py-1 text-sm cursor-pointer group relative ${
          isActive 
            ? 'bg-blue-500 text-white' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
        style={{ paddingLeft }}
      >
        <span>📄</span>
        
        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleRenameCancel}
            className="flex-1 bg-white dark:bg-gray-600 text-gray-800 dark:text-white px-1 rounded border focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span className="flex-1 truncate">{name}</span>
        )}

        {showContextMenu && (
          <div
            className="fixed bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-50 py-1 min-w-32"
            style={{ 
              left: contextMenuPos.x, 
              top: contextMenuPos.y,
              // Remove any backdrop blur that causes transparency
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleRename}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
            >
              Rename
            </button>
            <button
              onClick={() => onDelete(item.path)}
              className="w-full text-left px-3 py-2 hover:bg-red-500 hover:text-white text-sm text-gray-700 dark:text-gray-300"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }

  // It's a folder
  return (
    <div>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        onContextMenu={handleContextMenu}
        className={`flex items-center gap-2 px-2 py-1 text-sm cursor-pointer group ${
          isActive 
            ? 'bg-blue-500 text-white' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
        style={{ paddingLeft }}
      >
        <span>{isExpanded ? '📂' : '📁'}</span>
        
        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleRenameCancel}
            className="flex-1 bg-white dark:bg-gray-600 text-gray-800 dark:text-white px-1 rounded border focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span className="flex-1 truncate">{name}</span>
        )}

        <div className="opacity-0 group-hover:opacity-100 flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onNewFile(item.path); }}
            className="p-1 hover:bg-green-500 hover:text-white rounded"
            title="New File"
          >
            +
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNewFolder(item.path); }}
            className="p-1 hover:bg-purple-500 hover:text-white rounded"
            title="New Folder"
          >
            📁
          </button>
        </div>

        {showContextMenu && (
          <div
            className="fixed bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-50 py-1 min-w-32"
            style={{ 
              left: contextMenuPos.x, 
              top: contextMenuPos.y 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleRename}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
            >
              Rename
            </button>
            <button
              onClick={() => onNewFile(item.path)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
            >
              New File
            </button>
            <button
              onClick={() => onNewFolder(item.path)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
            >
              New Folder
            </button>
            <button
              onClick={() => onDelete(item.path)}
              className="w-full text-left px-3 py-2 hover:bg-red-500 hover:text-white text-sm text-gray-700 dark:text-gray-300"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isExpanded && item.children && (
        <div>
          {Object.entries(item.children).map(([childName, childItem]) => (
            <FileItem
              key={childName}
              name={childName}
              item={childItem}
              level={level + 1}
              activePath={activePath}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
              onNewFile={onNewFile}
              onNewFolder={onNewFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function FileTree({ activePath, onSelect, onNewFile, onNewFolder }) {
  const { files, projectStructure, setFiles, setActiveFile, updateFileStructure } = useProjectStore();

  const handleRename = (oldPath, newName) => {
    const newFiles = { ...files };
    
    // Handle folder rename
    if (oldPath.endsWith('/')) {
      const oldFolderPath = oldPath;
      const newFolderPath = newName.endsWith('/') ? newName : `${newName}/`;
      
      // Update all files in the folder
      Object.keys(newFiles).forEach(filePath => {
        if (filePath.startsWith(oldFolderPath)) {
          const newFilePath = filePath.replace(oldFolderPath, newFolderPath);
          newFiles[newFilePath] = newFiles[filePath];
          delete newFiles[filePath];
        }
      });
    } else {
      // Handle file rename
      const newFilePath = newName.includes('.') ? newName : `${newName}.js`;
      newFiles[newFilePath] = newFiles[oldPath];
      delete newFiles[oldPath];
      
      if (activePath === oldPath) {
        setActiveFile(newFilePath);
      }
    }
    
    updateFileStructure(newFiles);
  };

  const handleDelete = (path) => {
    if (Object.keys(files).length <= 1) {
      alert('Cannot delete the last item in the project');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${path}?`)) {
      const newFiles = { ...files };
      
      if (path.endsWith('/')) {
        // Delete folder and all its contents
        Object.keys(newFiles).forEach(filePath => {
          if (filePath.startsWith(path)) {
            delete newFiles[filePath];
          }
        });
      } else {
        delete newFiles[path];
      }
      
      updateFileStructure(newFiles);
      
      if (activePath === path || activePath.startsWith(path)) {
        const remainingFiles = Object.keys(newFiles);
        setActiveFile(remainingFiles[0]);
      }
    }
  };

  const handleNewFile = (folderPath = '') => {
    onNewFile(folderPath);
  };

  const handleNewFolder = (parentPath = '') => {
    onNewFolder(parentPath);
  };

  return (
    <div className="h-full overflow-auto">
      {Object.entries(projectStructure).map(([name, item]) => (
        <FileItem
          key={name}
          name={name}
          item={item}
          activePath={activePath}
          onSelect={onSelect}
          onRename={handleRename}
          onDelete={handleDelete}
          onNewFile={handleNewFile}
          onNewFolder={handleNewFolder}
        />
      ))}
    </div>
  );
}