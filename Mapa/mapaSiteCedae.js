$(document).ready(function(){

    var map,
    infoBox = [];

    map = new L.Map('map', {zoom: 12, center: new L.latLng([-22.951916, -43.2104872])});

    L.tileLayer('//mt{s}.googleapis.com/vt?x={x}&y={y}&z={z}',
    {
        maxZoom: 18,
        subdomains: [0,1,2,3]
    }).addTo(map);

    var defaultIcon = new L.icon({
        iconUrl: '/DesktopModules/cedae_public_StoreLocator/css/images/map-pin.png',
        iconSize: [31, 39],
        iconAnchor: [16, 39],
        popupAnchor: [0, -28]
    }),
    customOptions = {
        'maxWidth': '410',
        'className':'custom'
    },
    getTemplate = function(obj){
        var html = "<div class='local-name'>"+obj.nome+"</div>";
        if (obj.regiao != undefined) {
            html+="<div class='region'>";
            html+="<span>"+obj.regiao+"</span>";
            html+="</div>";
        }
        if (obj.endereco != undefined) {
            html+="<div class='adress'><b>Endereço:</b> "+obj.endereco+"</div>";
        }
        if (obj.telefone != undefined && obj.telefone.length > 0) {
            html+="<div class='tel'><b>Telefone:</b> "+obj.telefone+"</div>";
        }
        if (obj.cep != undefined && obj.cep.length > 0) {
            html+="<div class='cep'><b>CEP:</b> "+obj.cep+"</div>";
        }
        if (obj.horario != undefined && obj.horario.length > 0) {
            html+="<div class='hour'><b>Horário de Atendimento</b><br/>"+obj.horario+"</div>";
        }
        return html;
    };

    window.pinosAtivos = [];
    if (window.mapa != undefined && window.mapa.pins.length >0) {
        var item,marker;
        for (var index = 0,limite=window.mapa.pins.length; index < limite; index++) {
            item = window.mapa.pins[index]
            marker = L.marker(item.coordenadas, {icon: defaultIcon}).bindPopup(getTemplate(item),customOptions).addTo(map);
            map.addLayer(marker);
            window.pinosAtivos.push(marker);
        }
    }

    function abrirPinMapa(index) {
        if(window.pinosAtivos[index] != undefined){
            window.pinosAtivos[index].fire("click");
        }
    }

    function carregarPontos() {
        var $formBusca = $('#searchFormMap'),
        $inputText = $formBusca.find(".wrap-buscar .row input[type='text']"),
        $selectEstado = $formBusca.find("select"),
        $btnSubmit = $formBusca.find('.row.submit input'),
        $searchResult = $("#searchResult");
        
        var parameters = {};
        if($selectEstado.val() != ''){
            parameters.estado = $selectEstado.val();
        }
        if($inputText.val() != ''){
            parameters.search = $inputText.val();
        }
        $.ajax({
            url: $formBusca.attr('action'),
            method: $formBusca.attr('method'),
            dataType: 'json',
            data: parameters,
            beforeSend: function(jqXHR, settings){
                $formBusca.addClass('loading');
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('error', jqXHR, textStatus, errorThrown);
            },
            success: function(data, textStatus,jqXHR){
                var item,marker;
                for (var index = window.pinosAtivos.length-1,limite=0; index >= limite; index--) {
                    map.removeLayer(window.pinosAtivos[index]);
                    window.pinosAtivos.pop();
                }
                var bounds = [];
                $.each(data, function(index, item) {
                    if(typeof item.coordenadas == 'string'){
                        item.coordenadas = JSON.parse(item.coordenadas);
                    }
                    bounds.push(item.coordenadas);
                    var marker = L.marker(item.coordenadas, {icon: defaultIcon})
                    .bindPopup(getTemplate(item),customOptions)
                    .on("popupopen",function(event){
                        this.$li.addClass('opened');
                    })
                    .on("popupclose",function(event){
                        this.$li.removeClass('opened');
                    });
                    map.addLayer(marker);
                    var  $li = $('<li></li>'), $h4 = $('<h4></h4>'), $spanAdress = $('<span></span>'), $aMaisInfo = $('<a></a>');
                    $li.attr({
                        class: (index % 2 == 0 ?"active":'')
                    });
                    $h4.attr({
                        class: 'local-name'
                    }).html(item.nome);
                    $spanAdress.attr({
                        class: 'adress'
                    }).html('<b>Endereço: </b>' + item.endereco);
                    $aMaisInfo.attr({
                        class: 'more-info',
                        href: index,
                    }).html('Mais informações');

                    $aMaisInfo.on('click', function(event){
                        event.preventDefault();
                        abrirPinMapa($(this).attr('href'));
                    });

                    $li.append($h4);
                    $li.append($spanAdress);
                    $li.append($aMaisInfo);
                    marker.$li = $li;

                    $searchResult.append(marker.$li);

                    window.pinosAtivos.push(marker);
                    
                    for(var i=0; pinosAtivos.length > i; i++){
                        $('#btnEndereco').bind('click', function(event){
                            $("#searchResult").html("");
                        });
                        $('#txtEndereco').keypress(function(event){
                            $("#searchResult").html("");
                        });
                    }                
                });
                if(bounds.length > 0){
                    map.fitBounds(bounds);
                }
            },
            complete: function(jqXHR, textStatus){
                $formBusca.removeClass('loading');
            },
        });
        var clearTimer = false;

        $selectEstado.change(function(e){
            $inputText.val("");
            $btnSubmit.click();
        });
        $inputText.keyup(function(e){
            if(e.keyCode == 13){
                e.preventDefault();
                e.stopPropagation();
                return false;
            }else{
                if(clearTimer !== false){
                    clearTimeout(clearTimer);
                }
                clearTimer = setTimeout(function(){
                    $btnSubmit.click();
                    clearTimer = false; 
                },1000);
            }
        });
    }
    carregarPontos();
});