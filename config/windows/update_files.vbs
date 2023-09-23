Set objFSO = CreateObject("Scripting.FileSystemObject")
host = WScript.Arguments(0)

' Atualizar package.json
Call UpdateFile("..\..\frontend\package.json", "https://host_default/recargas", "https://"&host&"/recargas")

' Atualizar env.json
Call UpdateFile("..\..\frontend\src\env.json", "https://host_default/recargas/backend/src", "https://"&host&"/recargas/backend/src")

' Atualizar corsConfig.php
Call UpdateFile("..\..\backend\src\config\corsConfig.php", "'https://host_default'", "'https://"&host&"'")

Sub UpdateFile(filePath, searchText, replaceText)
    Dim strText
    If objFSO.FileExists(filePath) Then
        Set objFile = objFSO.OpenTextFile(filePath, 1)
        strText = objFile.ReadAll
        objFile.Close
        strNewText = Replace(strText, searchText, replaceText)
        
        Set objFile = objFSO.OpenTextFile(filePath, 2)
        objFile.Write strNewText
        objFile.Close
    Else
        WScript.Echo "File not found: " & filePath
        WScript.Quit(1)
    End If
End Sub
