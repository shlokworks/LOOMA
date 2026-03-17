// components/MonacoEditorPane.jsx
import { useRef, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { useThemeStore } from "../store/useThemeStore";

const guessLanguage = (path = "") => {
  if (path.endsWith(".js") || path.endsWith(".cjs") || path.endsWith(".mjs")) return "javascript";
  if (path.endsWith(".jsx")) return "javascript";
  if (path.endsWith(".ts"))  return "typescript";
  if (path.endsWith(".tsx")) return "typescript";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".css"))  return "css";
  if (path.endsWith(".html")) return "html";
  if (path.endsWith(".md"))   return "markdown";
  return "plaintext";
};

/**
 * Monaco editor pane with optional Y.js CRDT collaborative binding.
 *
 * Props:
 *   path        – active file path
 *   value       – current file content (from Zustand)
 *   onChange    – called with new content on local edit
 *   ydoc        – Y.Doc instance (passed from Workspace when collab is active)
 *   onCursorMove – callback(cursor, filePath) for awareness broadcasting
 *   remoteCursors – array of { user: { name, colour }, cursor: { lineNumber, column } }
 */
export default function MonacoEditorPane({
  path,
  value,
  onChange,
  ydoc        = null,
  onCursorMove,
  remoteCursors = [],
}) {
  const { theme } = useThemeStore();

  const editorRef        = useRef(null);
  const monacoRef        = useRef(null);
  const isRemoteRef      = useRef(false);   // flag: true when applying a remote Y.js update
  const bindingCleanup   = useRef(null);    // cleanup fn for current binding
  const decorationsRef   = useRef([]);      // remote cursor decorations

  // ─── Mount editor ─────────────────────────────────────────────────────
  const handleMount = useCallback((editor, monaco) => {
    editorRef.current  = editor;
    monacoRef.current  = monaco;
  }, []);

  // ─── Bind / rebind Y.js when ydoc or path changes ─────────────────────
  useEffect(() => {
    // Tear down previous binding
    if (bindingCleanup.current) { bindingCleanup.current(); bindingCleanup.current = null; }
    if (!ydoc || !editorRef.current || !path) return;

    const monaco = monacoRef.current;
    const editor = editorRef.current;
    const model  = editor.getModel();
    if (!model) return;

    // Get (or create) the Y.Text for this file
    const yText = ydoc.getText(path);

    // If Y.Text is empty, seed it with current editor value
    if (yText.length === 0 && value) {
      Y.transact(ydoc, () => { yText.insert(0, value); }, "seed");
    }

    // ── Y.Text → Monaco (remote changes) ────────────────────────────────
    const yObserver = (event, transaction) => {
      if (transaction.origin === "local") return; // skip our own changes

      isRemoteRef.current = true;
      let idx = 0;
      const edits = [];

      for (const op of event.delta) {
        if (op.retain) {
          idx += op.retain;
        } else if (op.insert && typeof op.insert === "string") {
          const pos = model.getPositionAt(idx);
          edits.push({
            range: new monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column),
            text:  op.insert,
          });
          idx += op.insert.length;
        } else if (op.delete) {
          const startPos = model.getPositionAt(idx);
          const endPos   = model.getPositionAt(idx + op.delete);
          edits.push({
            range: new monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column),
            text:  "",
          });
        }
      }

      if (edits.length) {
        model.pushEditOperations([], edits, () => null);
        // Sync Zustand value
        onChange(model.getValue());
      }
      isRemoteRef.current = false;
    };

    yText.observe(yObserver);

    // ── Monaco → Y.Text (local changes) ─────────────────────────────────
    const disposable = editor.onDidChangeModelContent((event) => {
      if (isRemoteRef.current) return; // skip echo of remote changes
      Y.transact(ydoc, () => {
        // Apply Monaco changes to Y.Text (sorted reverse to avoid offset shift)
        const sorted = [...event.changes].sort((a, b) => b.rangeOffset - a.rangeOffset);
        for (const change of sorted) {
          if (change.rangeLength > 0) yText.delete(change.rangeOffset, change.rangeLength);
          if (change.text)            yText.insert(change.rangeOffset, change.text);
        }
      }, "local");
    });

    // ── Cursor awareness ──────────────────────────────────────────────────
    const cursorDisposable = editor.onDidChangeCursorPosition((e) => {
      if (onCursorMove) {
        onCursorMove({ lineNumber: e.position.lineNumber, column: e.position.column }, path);
      }
    });

    bindingCleanup.current = () => {
      yText.unobserve(yObserver);
      disposable.dispose();
      cursorDisposable.dispose();
    };

    return () => {
      if (bindingCleanup.current) { bindingCleanup.current(); bindingCleanup.current = null; }
    };
  }, [ydoc, path]);

  // ─── Remote cursor decorations ─────────────────────────────────────────
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    // Clear previous decorations
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);

    if (remoteCursors.length === 0) return;

    const newDecorations = remoteCursors
      .filter(rc => rc.filePath === path && rc.cursor)
      .map(rc => ({
        range: new monaco.Range(
          rc.cursor.lineNumber, rc.cursor.column,
          rc.cursor.lineNumber, rc.cursor.column + 1
        ),
        options: {
          className:       "remote-cursor",
          afterContentClassName: "remote-cursor-label",
          stickiness:      monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          hoverMessage:    { value: rc.user.name },
          inlineClassName: `remote-cursor-inline`,
          before: {
            content:          " ",
            inlineClassName:  `remote-cursor-caret`,
            inlineClassNameAffectsLetterSpacing: true,
          },
          // Store colour via CSS variable using a unique class
          glyphMarginClassName: undefined,
        },
      }));

    decorationsRef.current = editor.deltaDecorations([], newDecorations);
  }, [remoteCursors, path]);

  return (
    <div className={`border-r border-neutral-200 dark:border-neutral-800 min-w-0 ${
      theme === "dark" ? "bg-gray-800" : "bg-white"
    }`}>
      <div className={`h-8 px-3 flex items-center text-xs border-b ${
        theme === "dark"
          ? "border-neutral-800 bg-gray-800 text-gray-200"
          : "border-neutral-200 bg-white text-gray-800"
      }`}>
        {path}
      </div>
      <Editor
        height="calc(100vh - 12rem)"
        defaultLanguage={guessLanguage(path)}
        language={guessLanguage(path)}
        value={value}
        onChange={(v) => { if (!isRemoteRef.current) onChange(v ?? ""); }}
        onMount={handleMount}
        options={{
          fontSize:              14,
          minimap:               { enabled: false },
          wordWrap:              "on",
          smoothScrolling:       true,
          automaticLayout:       true,
          scrollBeyondLastLine:  false,
          theme:                 theme === "dark" ? "vs-dark" : "vs",
        }}
      />
    </div>
  );
}
