<%@Page Language = "C#" %>
    <%@Import namespace="System.IO" %>
                    <%

string DataFilename = Server.MapPath("Dados.json");

//string dados="{ 'Concessionarias': [ 'Sanepar', 'Rio Aguas' ], "item": [ { 'Concessionaria': 'Sanepar', 'Cidade': 'Rio de janeiro', 'Bairro': 'Campo Grande' }, { 'Concessionaria': 'Sanepar', 'Cidade': 'Rio de janeiro', 'Bairro': 'Campo Grande' } ] }"; 
string dados=Context.Request["dados"]; 

if(dados!=null && dados!=null){
    
StreamWriter SW = new StreamWriter(DataFilename);
SW.WriteLine(dados);
SW.Close();

Response.Write("salvo com sucesso  !!!");
}
else
    Response.Write("Deu Algo errado !!!");

%>