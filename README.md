# PRF
Programrendszerek fejlesztése webáruház beadandó feladat

Követelmények

Az alapvető téma egy egyszerű webshop alkalmazás kidolgozása, a pontos termék, téma a hallgatókra van bízva. A projektmunkához az alábbi három komponens megvalósítása szükséges:

Angular alkalmazás (15p):
- külcsín nem számít, nyugodtan lehet "ronda" az alkalmazás, mindössze a login és hibakezelő/404 komponens mellett elég ha van két-három komponens, amelyek segítségével a felhasználó képes termékeket listázni, vásárolni
- legyen routing és authguard, a login és 404 hiba kivételével mindent csak bejelentkezés után lehessen elérni

NodeJS + MongoDB: (15p)
- NodeJS alapú regisztráció és bejelentkezés a Passport JS segítségével
- a MongoDB tárolja az árukészletet is, ezt lekérni csak regisztrált felhasználók kérhetik, módosítani, új árut felvenni pedig csak adminisztrátorok (admin felületet nem muszáj Angularban csinálni, erre elég, ha REST interfész van)
- a szerver legyen deployolva és elérhető Herokuból
- a CORS probléma legyen lekezelve vagy whitelist segítségével, vagy úgy, hogy a NodeJS szerver hostolja a lebuildelt Angular appot is
*  a passportos session (isAuthenticate, bejelentkezés ellenőrzése) csak akkor működik, ha a bebuildelt Angularos alkalmazás a NodeJS szerver public mappájából van hostolva ugyanazon a domainen mint a NodeJS szerver. Emiatt ha Firebase-en hostoljátok az Angulart, érdemesebb a NodeJS szervert csak az árukészlet kezelésére használni és a bejelentkezést-jogosultságkezelést a Firebase autentikációs moduljával megoldani csak az Angular oldalán

** ha a választás tisztán Angular-Firebase kombóra esik és nem készül el a NodeJS szerver, az a félév során fellépett problémák és nehézségek fényében nem jár pontlevonással   

Java Spring szerver + PostgreSQL (15 pont)
- a vásárlási információk, tranzakciók egy kisebb Java Spring szerver által legyenek lekezelve, mely szintén Herokura van deployolva és Spring Data JPA segítségével perzisztálja a vásárlásokat leíró adatokat
- a JPA-nak kétféle adattáblát kell kezelnie: egy Terméket és egy Tranzakciót, a Termék táblában bejegyzésnek csak akkor kell létrejönnie, amikor először jelenik meg az adott termék tranzakcióban, elég ha az id, név, ár attribútumokkal rendelkezik, a Tranzakciót sem kell túlgondolni: dátum, termékid, összeg
- a Termékeket és a Tranzakciókat is lehessen listázni REST végpontokon keresztül
- CORS problémákat le kell kezelni whitelist segítségével
* az előző ponthoz hasonlóan a JPA+PostgreSQL kombó megfelelő indoklás mellett helyettesíthető Java EE - Firebase integrációval, viszont ha a Java Spring szerverből nem készül el semmi, az -3 pontot ér

** a leadott anyag fényében csak a Tranzakció megléte kötelező, a Termék objektum létrehozása, illetve a Termék id alapján Tranzakciókat kilistázó REST végpont opcionális és plusz pontokat ér ezen a részen, ha Springben lett megvalósítva
