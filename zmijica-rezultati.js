

$(document).ready(function(){

    let nizKorisnika = [
        // {
            // korisnickoIme: "_",
            // rezultat: "_"
        // }
    ]
    
    inicijalizujPodatke();
    pocetakPrograma();

    function inicijalizujPodatke(){
        let korisnici = localStorage.getItem("korisnici");
        if(korisnici != null){
            nizKorisnika = JSON.parse(korisnici);
        }else{
            localStorage.setItem("korisnici", JSON.stringify(nizKorisnika));
        }
    }

    function dodajKorisnika(i, r){
        nizKorisnika.push(
            {
                korisnickoIme: i,
                rezultat: r
            }
        );
        localStorage.setItem("korisnici", JSON.stringify(nizKorisnika));
    }

    function komparator(korisnik1, korisnik2){
        return korisnik2.rezultat - korisnik1.rezultat;
    }

    function pocetakPrograma(){
        // uzmi vrednosti iz URL-a
        const urlParams = new URLSearchParams(window.location.search);
        ime = urlParams.get("ime");
        rezultat = urlParams.get("rezultat");
        // dodaj prethodnog takmicara i sortiraj, if uslov u slucaju da skacemo sa pocetne
        if(ime && rezultat)dodajKorisnika(ime, rezultat);
        nizKorisnika.sort(komparator);
        // ograniciti ispis na max 5 takmicara
        let duzina = (nizKorisnika.length) < 5 ? nizKorisnika.length : 5;
        // ispis takmicara
        for(let i = 0; i < duzina; i++){
            let tmp = $("<p></p>").html("Takmičar " + nizKorisnika[i]["korisnickoIme"] 
            + ", osvojeni poeni " + nizKorisnika[i]["rezultat"] + "<br>");
            $("#korisniciSaNajboljimRezultatima").append(tmp);
        }
        if(ime && rezultat){
            $("#rezultatProslePartije").html("Vaš rezultat:" + "<br>" + "Takmičar " + ime
            + ", osvojeni poeni " + rezultat + '\n');
        }

        // ukloniti ukoliko je dodato vise od 5 takmicara
        if(nizKorisnika.length > 5)nizKorisnika.pop();
    }

    $("#dugmePocetnaStranica").click(function(){
        let currentURL = window.location.href;
        let cleanURL = currentURL.split("?")[0];
        let newURL = cleanURL.replace(/zmijica-rezultati\.html$/, "zmijica-uputstvo.html");
        window.location.href = newURL;
    });

});