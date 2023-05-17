$(document).ready(function(){
    let prviPutUputstvo = true;
    let prviPutPodesavanja = true;

    function prikazKakoIgrati(){
        let h2 = $("<h2></h2>").html("Korisničko uputstvo:").addClass("glitch-text");
        let p = $("<p></p>").html("U igri „Zmijica“ igrač koristi tastere sa strelicama da pomera zmiju po tabli sa poljima. Kako zmija dolazi u dodir sa hranom, ona je jede i time raste za jedan članak. Igra se završava kada se zmija sudari sa ivicama ekrana ili sa sobom.").addClass("glitch-text");
        $("div#kakoIgrati").append(h2);
        $("div#kakoIgrati").append(p);
        prviPutUputstvo = false;
    }

    function sakrijKakoIgrati(){
        $("#kakoIgrati h2").remove();
        $("#kakoIgrati p").remove();
        prviPutUputstvo = true;
    }
    
    function prikazPodesavanja(){
        $("#podesavanja div.skriveno").show();
        prviPutPodesavanja = false;

    }

    function sakrijPodesavanja(){
        $("#podesavanja div.skriveno").hide();
        prviPutPodesavanja = true;
    }
    
    $("#igraj").on( "click", function(event) {
        event.preventDefault();

        const velicina = $("input[name='velicina']:checked").val();
        const nivo = $("input[name='nivo']:checked").val();
        window.location.href = "zmijica-igra.html?velicina="+velicina+"&nivo="+nivo;
    });

    $("#rezultati").on( "click", function(event) {
        event.preventDefault();
        window.location.href = "zmijica-rezultati.html";
    });

    $("#dugmeUputstvo").on("click", function(){
        if(prviPutUputstvo){
            $("#dugmeUputstvo").html("Sakrij uputstvo");
            prikazKakoIgrati();
        }
        else{
            $("#dugmeUputstvo").html("Kako igrati?");
            sakrijKakoIgrati();
        }
    });

    $("#dugmePodesavanja").on("click", function(){
        if(prviPutPodesavanja){
            $("#dugmePodesavanja").html("Sakrij podešavanja");
            prikazPodesavanja();
        }
        else{
            $("#dugmePodesavanja").html("Podešavanja");
            sakrijPodesavanja();
        }
    });
    
});