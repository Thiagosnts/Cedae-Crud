<%@Page Language = "C#" %>
<%@Import namespace="System.IO" %>
<%
    string DataFilename = Server.MapPath("Dados/dados.json");
    string Resposta =null;

    if(File.Exists(DataFilename))
        Resposta = File.ReadAllText(DataFilename);

    Response.Write(Resposta);
%>