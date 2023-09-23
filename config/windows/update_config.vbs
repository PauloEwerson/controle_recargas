Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile("..\..\backend\src\config\config.json", 1)
strContents = objFile.ReadAll
objFile.Close

Set regex = New RegExp
regex.Pattern = """(\w+)""\s*:\s*""?([^""]*)""?"
regex.Global = True

Set matches = regex.Execute(strContents)

For Each match in matches
    key = match.SubMatches(0)
    value = match.SubMatches(1)
    If key = WScript.Arguments(0) Then
        newValue = WScript.Arguments(1)
        strContents = Replace(strContents, match.Value, """" & key & """: """ & newValue & """")
    End If
Next

Set objFile = objFSO.OpenTextFile("..\..\backend\src\config\config.json", 2)
objFile.Write strContents
objFile.Close
