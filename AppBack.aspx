<%@Page Language = "C#" %>
    <%@Import namespace="System.IO" %>
                    <%

string DataFilename = Server.MapPath("Dados.json");

string dados="{ 'Concessionarias': [ 'Sanepar', 'Rio Aguas' ], item: [ { 'Concessionaria': 'Sanepar', 'Cidade': 'Rio de janeiro', 'Bairro': 'Campo Grande' }, { 'Concessionaria': 'Sanepar', 'Cidade': 'Rio de janeiro', 'Bairro': 'Campo Grande' } ] }"; 
//string dados=Context.Request["Campo"]; 

if(dados!=null){
    
StreamWriter SW = new StreamWriter(DataFilename);
SW.WriteLine(dados);
SW.Close();

Response.Write("salvo com sucesso !!!");
}
%>