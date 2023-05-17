
$(document).ready(function() {

    let nivo;
    let red;
    let kol;
    let smer;
    let hrana;
    let superHrana;
    let idSuperHrana;
    let handlerSuperHrana;
    let handlerKretanje;
    let rezultat;
    let najveci;
    let korisnikIzabraoSmer;
    let zmijicaPolja = [];
    let indikatorIgraZapoceta = false;
    let nizKorisnika = [];
    initFunc();
    alert("Pritiskom na strelice pomerate zmijicu u željenom pravcu.");

    function ocistiSvePromenljive() {
        obrisiHranu();
        obrisiSuperHranu();
        hrana = rezultat = superHrana = -1;
        handlerKretanje = handlerSuperHrana = -1;
        nivo = "";
        idSuperHrana = 0;
        red = kol = smer = 0;
        $("#tabela").empty();
        zmijicaPolja = [];
    }

    function odrediRedKolonu() {
        // dohvati parametre iz urla
        const urlParams = new URLSearchParams(window.location.search);
        id = urlParams.get("velicina");
        // obrada
        switch (id) {
            case "15x15":
                red = 15; kol = 15;
                break;
            case "30x30":
                red = 30; kol = 30;
                break;
            case "15x30":
                red = 15; kol = 30;
                break;
            default:
                red = 15; kol = 15;
        }
        nivo = urlParams.get("nivo");
        // obrada
        switch (nivo) {
            case "lako":
                nivo = 500;
                break;
            case "srednje":
                nivo = 250;
                break;
            case "tesko":
                nivo = 125;
                break;
            default:
                nivo = 500;
        }
        // postavljanje konstanti u tabelu
        let table = document.getElementById("tabela");
        const cellWidth = 100 / kol + '%';
        table.style.setProperty('--cell-width', cellWidth);
        const cellHeight = 100 / red + '%';
        table.style.setProperty('--cell-height', cellHeight);
    }

    function kreirajTabelu() {
        let cnt = 0;
        for(let i = 0; i < red; i++) {
            let rednovi = $("<tr></tr>");
            for(let j = 0; j < kol; j++) {
                let celija = $("<td></td>").attr("id", cnt);
                rednovi.append(celija);
                cnt++;
            }
            $("#tabela").append(rednovi);
        }
    }

    function kreirajZmijicu(){
        zmijicaPolja = [3, 2, 1, 0];
    }

    function obojiZmijicu(){
        for(let i = 1; i < zmijicaPolja.length; i++){
            $("#"+zmijicaPolja[i]).css({"background-color":"lightyellow"})
        }
        $("#"+zmijicaPolja[0]).css({"background-color":"yellow"});
    }
    
    function pomeriZmijicu(coor){
        for(let i = zmijicaPolja.length - 1; i > 0; i--){
            zmijicaPolja[i] = zmijicaPolja[i - 1];
        }
        zmijicaPolja[0] = coor;
    }

    function pomeriZmijicuPojeo(coor){
        for(let i = zmijicaPolja.length; i > 0; i--){
            zmijicaPolja[i] = zmijicaPolja[i - 1];
        }
        zmijicaPolja[0] = coor;
    }

    function napraviHranu(){
        if(zmijicaPolja.length == red * kol)krajIgre(0, rezultat);
        let tmp = -1;
        do{
            tmp = Math.floor(Math.random() * (red * kol - 1));
        }while(zmijicaPolja.includes(tmp) || tmp == superHrana);
        hrana = tmp;
    }

    function napraviSuperHranu(){
        // ostaje jos jedno polje za obicnu hranu, nema mesta za super hranu
        if(zmijicaPolja.length == red * kol - 1)return -1; 
        let tmp = -1;
        do{
            tmp = Math.floor(Math.random() * (red * kol - 1));
        }while(zmijicaPolja.includes(tmp) || tmp == hrana);
        superHrana = tmp;
        return 0;
    }

    function obrisiHranu(){
        $(".circle").removeClass("circle").remove(); 
    }

    function obrisiSuperHranuTajmer(idsuper){
        setTimeout(function(){
            $("#" + idsuper + "idSuper").remove();
            // $(".circleSuper").removeClass("circleSuper").remove(); 
        },3000);
    }

    function obrisiSuperHranu(){
        $(".circleSuper").removeClass("circleSuper").remove(); 
    }

    function obojiHranu(){
        let td = $("td#"+hrana);
        let tdPosition = td.position();
        let krug = $("<div></div>").attr("id", "krugId").addClass("circle").css({
            "width":td.outerWidth(),
            "height":td.outerHeight(),
            "top":tdPosition.top,
            "left":tdPosition.left
        });
        $("body").append(krug);
    }

    function obojiSuperHranu(){
        let td = $("td#"+superHrana);
        let tdPosition = td.position();
        let krug = $("<div></div>").attr("id", idSuperHrana + "idSuper").addClass("circleSuper").css({
            "width":td.outerWidth(),
            "height":td.outerHeight(),
            "top":tdPosition.top,
            "left":tdPosition.left
        });
        obrisiSuperHranuTajmer(idSuperHrana); // poenta je da se cuva kao lokalna promenljiva
        idSuperHrana++;
        $("body").append(krug);
    }

    function azurirajRezultat(){
        rezultat += 1;
        $("#rezultat").html(rezultat + "&ensp;");
        if(rezultat > najveci){
            najveci = rezultat;
            ispisiNajbolji();
        }
    }

    function azurirajRezultatSuperHrana(){
        rezultat += 10;
        $("#rezultat").html(rezultat + "&ensp;");
        if(rezultat > najveci){
            najveci = rezultat;
            ispisiNajbolji();
        }
    }

    function intervalSuperHrana(){
        handlerSuperHrana = setInterval(function(){
            napraviSuperHranu();
            obojiSuperHranu();
        }, 10000);
    }

    function intervalKretanje(){
        handlerKretanje = setInterval(function(){
            switch(smer){
                // right, 0
                case 0:
                    coor = zmijicaPolja[0] + 1;
                    ret = kretanje(coor, 0, true);
                    break;
                // down, 1
                case 1:
                    coor = zmijicaPolja[0] +kol;
                    ret = kretanje(coor, 1, true);
                    break;
                // left, 2
                case 2:
                    coor = zmijicaPolja[0] - 1;
                    ret = kretanje(coor, 2, true);
                    break;
                // up, 3
                case 3:
                    coor = zmijicaPolja[0] - kol;
                    ret = kretanje(coor, 3, true);
                    break;
            }
            korisnikIzabraoSmer = false;
            if(ret == -1)krajIgre(-1, rezultat);
            if(ret == -2)krajIgre(-2, rezultat);
        }, nivo);
    }

    function ispisiNajbolji(){
        $("#najbolji").html(najveci + "&ensp;");
    }

    function initFunc() {
        inicijalizujPodatkeLocalStorage();
        ocistiSvePromenljive();
        odrediRedKolonu();
        kreirajTabelu();
        kreirajZmijicu();
        obojiZmijicu();
        napraviHranu();
        obojiHranu();
        azurirajRezultat();
        nadjiNajveci();
        ispisiNajbolji();
    }

    function daLiJeSuprotanSmerUOdnosuNaKretanje(dir){
        if(Math.abs(dir - smer) == 2)
            return 1;
        else return 0;
    }

    function daLiJeUdarioUZid(coor){
        if(coor < 0 || coor > red*kol - 1) return -1;
        if(zmijicaPolja[0] % kol == kol - 1 && coor % kol == 0) return -1;
        if(zmijicaPolja[0] % kol == 0 && coor % kol == kol - 1) return -1;
        return 0;
    }
    function daLijeUjelaSamuSebe(coor){
        if(zmijicaPolja.includes(coor))return -1;
        else return 0;
    }

    function pojeoHranu(coor){
        if(coor == hrana) return true;
        else return false;
    }

    function pojeoSuperHranu(coor){
        if(coor == superHrana) return true;
        else return false;
    }

    function kretanje(coor, dir, auto){
        if(smer == dir && !auto)return 0;
        if(daLiJeSuprotanSmerUOdnosuNaKretanje(dir) == 1)return 0;
        if(daLiJeUdarioUZid(coor) == -1) return -1;
        if(daLijeUjelaSamuSebe(coor) == -1)return -2;
        if(pojeoHranu(coor)){
            pomeriZmijicuPojeo(coor);
            obrisiHranu();
            napraviHranu();
            obojiHranu();
            azurirajRezultat();
        }
        // ukoliko ju je pojeo ne kreiramo novu jer se to radi na 10s
        if(pojeoSuperHranu(coor)){ 
            pomeriZmijicuPojeo(coor);
            obrisiSuperHranu();
            azurirajRezultatSuperHrana();
        }
        else pomeriZmijicu(coor);
        $("#tabela").empty();
        kreirajTabelu();
        obojiZmijicu();
        smer = dir;
        return 0;
    }

    function zaustaviNiti(){
        clearInterval(handlerKretanje);
        clearInterval(handlerSuperHrana);
    }

    function inicijalizujPodatkeLocalStorage(){
        let korisnici = localStorage.getItem("korisnici");
        if(korisnici != null){
            nizKorisnika = JSON.parse(korisnici);
        }else{
            localStorage.setItem("korisnici", JSON.stringify(nizKorisnika));
        }
    }

    function komparator(korisnik1, korisnik2){
        return korisnik2.rezultat - korisnik1.rezultat;
    }

    function nadjiNajveci(){
        if(nizKorisnika.length == 0){
            najveci = 0;
            return;
        }
        nizKorisnika.sort(komparator);
        najveci = nizKorisnika[0].rezultat;
    }

    function proveriJedinstvenost(ime){
        if(ime == "Takmičar")return true;
        for(let i = 0; i < nizKorisnika.length; i++){
            if(ime == nizKorisnika[i]["korisnickoIme"]){
                return false;
            }
        }
        return true;
    }

    function krajIgre(exitKod, rezultat){
        let poruka;
        switch(exitKod){
            case 0:
                poruka = "Pobedili ste!"
                break;
            case -1:
                poruka = "Igra je gotova, udarili ste u zid!"
                break;
            case -2:
                poruka = "Igra je gotova, pojeli ste sami sebe!"
                break;
        }
        zaustaviNiti();
        indikatorIgraZapoceta = false;
        let tmpRez = rezultat;
        let ime;
        let prviPut = 0;
        let confirmRet = false;
        do{
            if(prviPut != 0){
                confirmRet = confirm("Da li zelite da se upišete pod imenom Takmičar (oopcija OK) ili da pokušate sa drugim korisničkim imenom");
            }
            if(confirmRet){
                ime = "Takmičar";
                break;
            }
            ime = prompt(poruka + " Vaš rezultat je: " + rezultat + ". Unesite ime pod kojim želite da se čuva rezultat.");
            prviPut++;
        }while(!proveriJedinstvenost(ime) || ime==null || ime=="");
        ocistiSvePromenljive();
        obradiURLISkoci(ime, tmpRez);
    }

    function obradiURLISkoci(ime, rez){
        let currentURL = window.location.href;
        let cleanURL = currentURL.split("?")[0];
        let newURL = cleanURL.replace(/zmijica-igra\.html$/, "zmijica-rezultati.html");
        let finalURL = newURL + "?ime=" + ime + "&rezultat="+rez;
        window.location.href = finalURL;
    }

    $(document).keydown(function(event){
        if(!indikatorIgraZapoceta)return;
        if(korisnikIzabraoSmer)return;
        let coor = -1;
        let ret = 0;
        korisnikIzabraoSmer = true;
        switch(event.keyCode){
            // arrow left, 2
            case 37:
                // coor = zmijicaPolja[0] - 1;
                // ret = kretanje(coor, 2, false);
                if(daLiJeSuprotanSmerUOdnosuNaKretanje(2) == 1)return 0;
                smer = 2;
                break;
            // arrow up, 3
            case 38:
                // coor = zmijicaPolja[0] - kol;
                // ret = kretanje(coor, 3, false);
                if(daLiJeSuprotanSmerUOdnosuNaKretanje(3) == 1)return 0;
                smer = 3;
                break;
            // arrow right, 0
            case 39:
                // coor = zmijicaPolja[0] + 1;
                // ret = kretanje(coor, 0, false);
                if(daLiJeSuprotanSmerUOdnosuNaKretanje(0) == 1)return 0;
                smer = 0;
                break;
            // arrow down, 1
            case 40:
                // coor = zmijicaPolja[0] +kol;
                // ret = kretanje(coor, 1, false);
                if(daLiJeSuprotanSmerUOdnosuNaKretanje(1) == 1)return 0;
                smer = 1;
                break;
        }
        if(ret == -1)krajIgre(-1, rezultat);
        if(ret == -2)krajIgre(-2, rezultat);
    });

    $("#dugmePokreniIgru").click(function(){
        if(indikatorIgraZapoceta)return;
        indikatorIgraZapoceta = true;
        intervalKretanje();
        intervalSuperHrana();
    });
});
