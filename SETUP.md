# 安裝與運行指南

## 解決 PowerShell 執行策略問題

如果您遇到 "running scripts is disabled on this system" 錯誤，可以使用以下方法：

### 方法 1：修改 PowerShell 執行策略（推薦）

1. **以管理員身份打開 PowerShell**：
   - 按 `Win + X`
   - 選擇「Windows PowerShell (管理員)」或「終端 (管理員)」

2. **執行以下命令**：
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **確認變更**：輸入 `Y` 並按 Enter

4. **關閉並重新打開終端**，然後執行：
   ```bash
   npm install
   npm run dev
   ```

### 方法 2：使用 CMD（命令提示符）

如果不想修改 PowerShell 設置，可以使用 CMD：

1. 按 `Win + R`，輸入 `cmd`，按 Enter
2. 導航到項目目錄：
   ```cmd
   cd C:\Users\littl\Desktop\ResignCollection\ResignCollection
   ```
3. 執行安裝命令：
   ```cmd
   npm install
   npm run dev
   ```

### 方法 3：臨時繞過執行策略

在當前 PowerShell 會話中執行：

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

然後執行：
```bash
npm install
npm run dev
```

注意：此方法只在當前會話有效，關閉終端後需要重新執行。

## 安裝步驟

1. **安裝依賴**：
   ```bash
   npm install
   ```

2. **啟動開發服務器**：
   ```bash
   npm run dev
   ```

3. **在瀏覽器中打開顯示的地址**（通常是 `http://localhost:5173`）

## 常見問題

### 如果 npm 命令仍然無法使用

可以嘗試使用完整路徑：
```powershell
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" run dev
```

### 檢查 Node.js 是否正確安裝

```bash
node --version
npm --version
```

如果這些命令無法執行，請重新安裝 Node.js：https://nodejs.org/
