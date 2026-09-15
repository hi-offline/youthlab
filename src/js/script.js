/* =========================================================

    INTRO

========================================================= */

const intro = document.getElementById("intro");
const introVideo = document.getElementById("introVideo");
let fechado = false;

/* ------------------------------

    CONTROLE DA INTRO

------------------------------ */

/* ----- FECHAR INTRO ----- */

function fecharIntro() {

    if (fechado || !intro) return;

    fechado = true;

    intro.classList.add("hide");

    setTimeout(() => {

        intro.style.display = "none";

        typeWriter();

    }, 800);

}

/* ----- FINAL DO VÍDEO ----- */

if (introVideo) {

    introVideo.addEventListener("ended", fecharIntro);

}

/* ----- TECLA ENTER ----- */

document.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        fecharIntro();

    }

});

/* ----- CLIQUE NA INTRO ----- */

document.addEventListener("click", (e) => {

    if (!fechado && intro && intro.contains(e.target)) {

        fecharIntro();

    }

});


/* =========================================================

    VÍDEO DO YOUTUBE

========================================================= */

const openVideo = document.getElementById("openVideo");
const closeVideo = document.getElementById("closeVideo");
const videoModal = document.getElementById("videoModal");
const youtubeFrame = document.getElementById("youtubeFrame");

const youtubeEmbed =
    "https://www.youtube.com/embed/e_X1mnIhAWo?autoplay=1&rel=0";

/* ------------------------------

    CONTROLE DO MODAL

------------------------------ */

/* ----- ABRIR VÍDEO ----- */

function abrirVideo(e) {

    e.preventDefault();
    e.stopPropagation();

    if (!videoModal || !youtubeFrame) return;

    videoModal.classList.add("active");

    youtubeFrame.src = youtubeEmbed;

}

/* ----- FECHAR VÍDEO ----- */

function fecharVideo() {

    if (videoModal) {

        videoModal.classList.remove("active");

    }

    if (youtubeFrame) {

        youtubeFrame.src = "";

    }

}

/* ----- BOTÃO ABRIR ----- */

if (openVideo) {

    openVideo.addEventListener("click", abrirVideo);

}

/* ----- BOTÃO FECHAR ----- */

if (closeVideo) {

    closeVideo.addEventListener("click", (e) => {

        e.stopPropagation();

        fecharVideo();

    });

}

/* ----- CLIQUE FORA DO MODAL ----- */

if (videoModal) {

    videoModal.addEventListener("click", (e) => {

        if (e.target === videoModal) {

            fecharVideo();

        }

    });

}

/* ----- TECLA ESC ----- */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        fecharVideo();

    }

});


/* =========================================================

    ANIMAÇÃO DOS CARDS

========================================================= */

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries, observer) => {

    entries.forEach((entry, index) => {

        if (entry.isIntersecting) {

            setTimeout(() => {

                entry.target.classList.add("show");

                if (entry.target.querySelector(".progress-card")) {

                    animateSalary();

                }

            }, index * 180);

            observer.unobserve(entry.target);

        }

    });

}, {

    threshold: 0.2

});

cards.forEach(card => observer.observe(card));


/* =========================================================

    SCORE CIRCULAR

========================================================= */

const circle = document.querySelector(".progress-value");
const number = document.getElementById("salaryValue");
const radius = 70;
const circumference = 2 * Math.PI * radius;

/* ------------------------------

    CONFIGURAÇÃO

------------------------------ */

if (circle) {

    circle.setAttribute("stroke-dasharray", circumference);
    circle.setAttribute("stroke-dashoffset", circumference);

}

/* ----- ANIMAÇÃO DO SCORE ----- */

function animateSalary() {

    if (!circle || !number) return;

    const percent = 78.7;

    const offset =
        circumference - (percent / 100) * circumference;

    circle.style.transition = "stroke-dashoffset 2s ease";

    circle.setAttribute("stroke-dashoffset", offset);

    let current = 0;

    const timer = setInterval(() => {

        if (current < 78) {

            current++;

        } else {

            current += 0.1;

        }

        if (current >= percent) {

            current = percent;

            clearInterval(timer);

        }

        number.textContent =
            current % 1 === 0
                ? current
                : current.toFixed(1);

    }, 25);

}


/* =========================================================

    PIE CHART

========================================================= */

/* ------------------------------

    FUNÇÕES

------------------------------ */

/* ----- CONVERTER COORDENADAS POLARES ----- */

function polar(cx, cy, r, angle) {

    const rad = angle * Math.PI / 180;

    return {

        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad)

    };

}

/* ----- CRIAR FATIA ----- */

function createSlice(
    cx,
    cy,
    radius,
    startAngle,
    endAngle,
    color
) {

    const start = polar(
        cx,
        cy,
        radius,
        startAngle
    );

    const end = polar(
        cx,
        cy,
        radius,
        endAngle
    );

    const largeArc =
        endAngle - startAngle > 180
            ? 1
            : 0;

    const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );

    const d = `

        M ${cx} ${cy}

        L ${start.x} ${start.y}

        A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}

        Z

    `;

    path.setAttribute("d", d);
    path.setAttribute("fill", color);

    path.style.opacity = "0";
    path.style.transformOrigin = "center";
    path.style.transform = "scale(0.2)";

    path.style.transition =
        "opacity .5s ease, transform .5s ease";

    return path;

}


/* ------------------------------

    ANIMAÇÃO

------------------------------ */

const pieChart = document.getElementById("pieChart");

/* ----- CRIAR ANIMAÇÃO ----- */

function createPieAnimation() {

    if (!pieChart) return;

    const TOTAL_SLICES = 36;
    const VALUE_PERCENT = 38;

    const cx = 120;
    const cy = 120;
    const radius = 95;

    const purpleSlices = Math.round(
        TOTAL_SLICES * VALUE_PERCENT / 100
    );

    for (let i = 0; i < TOTAL_SLICES; i++) {

        const startAngle =
            i * (360 / TOTAL_SLICES);

        const endAngle =
            (i + 1) * (360 / TOTAL_SLICES);

        const color =
            i < purpleSlices
                ? "#b44cff"
                : "rgba(255,255,255,.18)";

        const slice = createSlice(
            cx,
            cy,
            radius,
            startAngle,
            endAngle,
            color
        );

        pieChart.appendChild(slice);

        setTimeout(() => {

            slice.style.opacity = "1";
            slice.style.transform = "scale(1)";

        }, i * 45);

    }

}


/* ------------------------------

    OBSERVER

------------------------------ */

const pieCard = document.querySelector(".pie-chart");

const pieObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            createPieAnimation();

            pieObserver.unobserve(entry.target);

        }

    });

}, {

    threshold: 0.4

});

if (pieCard) {

    pieObserver.observe(pieCard);

}


/* =========================================================

    ANIMAÇÃO DE COLUNA

========================================================= */

const chart = document.querySelector(".bar-chart");

const chartObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            chart.classList.add("chart-animation");

            chartObserver.disconnect();

        }

    });

}, {

    threshold: 0.5

});

if (chart) {

    chartObserver.observe(chart);

}


/* =========================================================

    ANIMAÇÃO DE ESCRITA

========================================================= */

const title = document.getElementById("heroTitle");
const text = title ? title.dataset.text : "";
let index = 0;

/* ----- EFEITO DE DIGITAÇÃO ----- */

function typeWriter() {

    if (!title) return;

    if (index < text.length) {

        title.textContent += text.charAt(index);

        index++;

        setTimeout(typeWriter, 65);

    } else {

        setTimeout(() => {

            title.classList.add("typing-done");

        }, 3000);

    }

}


/* =========================================================

    RELÓGIO DE IMPACTO

========================================================= */

const clockHand = document.querySelector(".clock-hand");
const impactTimer = document.getElementById("impactTimer");
const impactCounter = document.getElementById("impactCounter");
const impactPulse = document.querySelector(".impact-pulse");
const impactPulseTwo = document.querySelector(".impact-pulse-two");

if (clockHand && impactTimer) {

    let seconds = 60;
    let victims = 0;

    /* ------------------------------

        EFEITO DE IMPACTO

    ------------------------------ */

    /* ----- DISPARAR IMPACTO ----- */

    function triggerImpact() {

        const clock = document.querySelector(".clock");

        if (!clock || !impactPulse) return;

        const rect =
            clock.getBoundingClientRect();

        const centerX =
            rect.left + rect.width / 2;

        const centerY =
            rect.top + rect.height / 2;

        const distanceLeft = centerX;

        const distanceRight =
            window.innerWidth - centerX;

        const distanceTop = centerY;

        const distanceBottom =
            window.innerHeight - centerY;

        const maxDistance = Math.max(
            distanceLeft,
            distanceRight,
            distanceTop,
            distanceBottom
        );

        const diameter =
            maxDistance * 2;

        impactPulse.style.left =
            `${centerX}px`;

        impactPulse.style.top =
            `${centerY}px`;

        impactPulse.style.width =
            `${diameter}px`;

        impactPulse.style.height =
            `${diameter}px`;

        impactPulse.classList.remove("active");

        void impactPulse.offsetWidth;

        impactPulse.classList.add("active");

        setTimeout(() => {

            if (!impactPulseTwo) return;

            impactPulseTwo.style.left =
                `${centerX}px`;

            impactPulseTwo.style.top =
                `${centerY}px`;

            impactPulseTwo.style.width =
                `${diameter}px`;

            impactPulseTwo.style.height =
                `${diameter}px`;

            impactPulseTwo.classList.remove("active");

            void impactPulseTwo.offsetWidth;

            impactPulseTwo.classList.add("active");

        }, 180);

    }

    /* ------------------------------

        ATUALIZAÇÃO DO RELÓGIO

    ------------------------------ */

    /* ----- ATUALIZAR RELÓGIO ----- */

    function updateClock() {

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;

        impactTimer.textContent =
            `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

        const elapsed =
            60 - seconds;

        const rotation =
            elapsed * 6;

        clockHand.style.transform =
            `translateX(-50%) rotate(${rotation}deg)`;

        if (seconds === 0) {

            triggerImpact();

            victims++;

            if (impactCounter) {

                impactCounter.textContent = victims;

            }

        }

        seconds--;

        if (seconds < 0) {

            seconds = 60;

        }

    }

    updateClock();

    setInterval(updateClock, 1000);

}


/* =========================================================

    MULHERES QUE MUDARAM O MUNDO

========================================================= */

const women = [

    {
        name: "Cleópatra",
        image: "./img/historical-figures/Cleópatra.png",
        description:
            "Uma das figuras políticas mais conhecidas do Egito Antigo, lembrada por sua liderança, diplomacia e influência política.",
        details:
            "Cleópatra VII foi a última grande governante do Egito da dinastia ptolomaica. Conhecida por sua inteligência política e capacidade diplomática, estabeleceu alianças com importantes líderes romanos, incluindo Júlio César e Marco Antônio. Durante seu governo, buscou preservar a autonomia e a estabilidade do Egito em um período de forte influência romana."
    },

    {
        name: "Hipátia de Alexandria",
        image: "./img/historical-figures/Hipátia de Alexandria.png",
        description:
            "Matemática, astrônoma e filósofa da Antiguidade, considerada uma das grandes mulheres da história da ciência.",
        details:
            "Hipátia de Alexandria viveu entre os séculos IV e V e foi uma importante professora e intelectual da cidade de Alexandria, no Egito. Dedicou-se à matemática, à astronomia e à filosofia, ensinando e produzindo conhecimentos em uma época em que o acesso das mulheres à educação era extremamente limitado. Sua morte violenta fez com que se tornasse, posteriormente, um símbolo da busca pelo conhecimento e da liberdade intelectual."
    },

    {
        name: "Joana d'Arc",
        image: "./img/historical-figures/Joana d'Arc.png",
        description:
            "Figura histórica francesa que se tornou símbolo de liderança, resistência e participação feminina na história.",
        details:
            "Joana d'Arc nasceu na França por volta de 1412 e participou da Guerra dos Cem Anos. Ainda jovem, tornou-se uma figura importante para as forças francesas durante o conflito contra a Inglaterra. Capturada em 1430, foi julgada e executada em 1431. Décadas depois, seu julgamento foi revisto e ela foi considerada inocente. Séculos mais tarde, Joana foi canonizada pela Igreja Católica e tornou-se um dos símbolos históricos mais conhecidos da França.",
        objectPosition: "center 20%"
    },

    {
        name: "Mary Wollstonecraft",
        image: "./img/historical-figures/Mary Wollstonecraft.png",
        description:
            "Filósofa e escritora britânica considerada uma das precursoras do pensamento feminista moderno.",
        details:
            "Mary Wollstonecraft foi uma escritora e filósofa britânica do século XVIII. Em sua obra mais conhecida, 'A Vindication of the Rights of Woman', publicada em 1792, defendeu que as mulheres deveriam ter acesso à educação e oportunidades semelhantes às dos homens. Para ela, muitas diferenças atribuídas às mulheres eram resultado da falta de educação e das limitações impostas pela sociedade. Seu pensamento tornou-se uma referência importante para a história do feminismo.",
        objectPosition: "center 20%"
    },

    {
        name: "Ada Lovelace",
        image: "./img/historical-figures/Ada Lovelace.png",
        description:
            "Matemática considerada uma das pioneiras da programação por seu trabalho com a Máquina Analítica de Charles Babbage.",
        details:
            "Ada Lovelace foi uma matemática britânica do século XIX que trabalhou com as ideias de Charles Babbage e sua Máquina Analítica. Ao traduzir um artigo sobre a máquina, acrescentou suas próprias notas, incluindo um algoritmo destinado a ser processado pela máquina. Essas notas são frequentemente consideradas um dos primeiros exemplos publicados de um programa de computador. Ada também percebeu que máquinas desse tipo poderiam ter aplicações muito além de cálculos matemáticos.",
        objectPosition: "center 15%"
    },

    {
        name: "Marie Curie",
        image: "./img/historical-figures/Marie Curie.png",
        description:
            "Cientista pioneira no estudo da radioatividade e primeira pessoa a receber dois Prêmios Nobel em áreas científicas diferentes.",
        details:
            "Marie Curie foi uma física e química polonesa naturalizada francesa que dedicou sua carreira ao estudo da radioatividade. Ao lado de Pierre Curie, descobriu os elementos polônio e rádio. Foi a primeira mulher a receber um Prêmio Nobel e a primeira pessoa a conquistar dois Nobéis em áreas científicas diferentes.",
        objectPosition: "center 20%"
    },

    {
        name: "Nise da Silveira",
        image: "./img/historical-figures/Nise da Silveira.png",
        description:
            "Psiquiatra brasileira que transformou a forma de compreender e tratar pessoas em sofrimento psíquico.",
        details:
            "Nise da Silveira foi uma psiquiatra brasileira que revolucionou o tratamento de pessoas em sofrimento psíquico. Contrária a métodos violentos e desumanizantes, valorizou atividades como pintura e modelagem como formas de expressão e tratamento. Seu trabalho contribuiu para uma abordagem mais humanizada da saúde mental no Brasil."
    },

    {
        name: "Bertha Lutz",
        image: "./img/historical-figures/Bertha Lutz.png",
        description:
            "Cientista e uma das principais figuras brasileiras na luta pelos direitos políticos das mulheres.",
        details:
            "Bertha Lutz foi uma cientista, bióloga e importante ativista brasileira pelos direitos das mulheres. Participou da luta pelo direito ao voto feminino e teve papel relevante na organização do movimento feminista brasileiro. Também atuou na política e participou da elaboração de propostas relacionadas aos direitos das mulheres."
    },

    {
        name: "Rosa Parks",
        image: "./img/historical-figures/Rosa Parks.png",
        description:
            "Ativista dos direitos civis cuja resistência à segregação racial se tornou um símbolo da luta por igualdade.",
        details:
            "Rosa Parks foi uma ativista norte-americana dos direitos civis. Em 1955, recusou-se a ceder seu assento a um passageiro branco em um ônibus segregado no Alabama. Sua prisão ajudou a desencadear o boicote aos ônibus de Montgomery, um dos acontecimentos marcantes da luta contra a segregação racial nos Estados Unidos."
    },

    {
        name: "Frida Kahlo",
        image: "./img/historical-figures/Frida Kahlo.png",
        description:
            "Artista mexicana cuja obra marcou a história da arte ao explorar identidade, corpo, dor e experiência pessoal.",
        details:
            "Frida Kahlo foi uma artista mexicana conhecida por seus autorretratos e por uma obra profundamente ligada à identidade, ao corpo e às experiências pessoais. Sua pintura abordou temas como dor física, relacionamentos, cultura mexicana e identidade. Com o passar do tempo, tornou-se uma das artistas latino-americanas mais reconhecidas internacionalmente."
    },

    {
        name: "Cecília Meireles",
        image: "./img/historical-figures/Cecília Meireles.png",
        description:
            "Poeta, escritora e educadora brasileira, considerada uma das grandes vozes da literatura brasileira do século XX.",
        details:
            "Cecília Meireles foi uma das principais escritoras brasileiras do século XX. Sua produção passou pela poesia, crônica, literatura infantil e educação. Sua escrita é marcada por temas como passagem do tempo, solidão, memória e espiritualidade. Além de sua importância literária, também atuou como educadora e participou de debates sobre educação e cultura no Brasil."
    },

    {
        name: "Jane Goodall",
        image: "./img/historical-figures/Jane Goodall.png",
        description:
            "Primatóloga e antropóloga britânica reconhecida por seus estudos pioneiros sobre chimpanzés e por sua atuação em defesa da conservação ambiental.",
        details:
            "Jane Goodall iniciou seus estudos sobre chimpanzés na Tanzânia em 1960 e realizou observações que transformaram o conhecimento científico sobre esses animais. Ela identificou comportamentos como o uso de ferramentas e destacou a complexidade das relações sociais dos chimpanzés. Posteriormente, ampliou sua atuação para a conservação ambiental e a defesa dos animais, criando iniciativas voltadas à educação e à preservação da natureza."
    },

    {
        name: "Tarsila do Amaral",
        image: "./img/historical-figures/Tarsila do Amaral.png",
        description:
            "Artista brasileira fundamental para o modernismo, cuja obra ajudou a transformar a arte brasileira no século XX.",
        details:
            "Tarsila do Amaral foi uma das figuras centrais do modernismo brasileiro. Sua obra combinou influências das vanguardas europeias com elementos da cultura e da paisagem brasileira. Entre suas pinturas mais conhecidas estão 'Abaporu' e 'Operários'. Seu trabalho ajudou a construir uma linguagem artística moderna que valorizava temas, personagens e elementos da realidade brasileira.",
        objectPosition: "center 30%"
    },

    {
        name: "Amelia Earhart",
        image: "./img/historical-figures/Amelia Earhart.png",
        description:
            "Pioneira da aviação norte-americana e a primeira mulher a realizar um voo solo sem escalas pelo Atlântico.",
        details:
            "Amelia Earhart foi uma pioneira da aviação norte-americana e uma das primeiras mulheres a alcançar grande reconhecimento nesse campo. Em 1928, tornou-se a primeira mulher a atravessar o Atlântico de avião como passageira e, em 1932, realizou sozinha a travessia sem escalas. Também estabeleceu outros recordes de aviação e defendeu a maior participação das mulheres na área. Desapareceu em 1937 durante uma tentativa de realizar um voo ao redor do mundo."
    },

    {
        name: "Maria da Penha",
        image: "./img/historical-figures/Maria da Penha.png",
        description:
            "Farmacêutica e ativista brasileira cuja trajetória se tornou símbolo da luta contra a violência doméstica e deu nome à Lei Maria da Penha.",
        details:
            "Maria da Penha Maia Fernandes é uma farmacêutica brasileira que se tornou símbolo da luta contra a violência doméstica. Após sofrer violência e sobreviver a duas tentativas de homicídio cometidas por seu então marido, buscou justiça durante anos. Seu caso chegou à Comissão Interamericana de Direitos Humanos e contribuiu para pressionar o Estado brasileiro a fortalecer a proteção às mulheres. Em 2006, foi criada a Lei Maria da Penha, que estabeleceu mecanismos específicos de prevenção e combate à violência doméstica e familiar contra a mulher."
    },

    {
        name: "Dandara dos Palmares",
        image: "./img/historical-figures/Dandara dos Palmares.png",
        description:
            "Figura histórica associada à resistência do Quilombo dos Palmares e à luta contra a escravidão.",
        details:
            "Dandara dos Palmares é uma figura histórica associada ao Quilombo dos Palmares, um dos maiores símbolos de resistência à escravidão no Brasil colonial. As informações documentais sobre sua vida são limitadas, mas registros e tradições históricas a associam à resistência armada e à organização da comunidade de Palmares. Sua trajetória tornou-se um símbolo da participação das mulheres negras na resistência à escravidão.",
        objectPosition: "center center"
    },

    {
        name: "Hedy Lamarr",
        image: "./img/historical-figures/Hedy Lamarr.png",
        description:
            "Atriz e inventora que participou do desenvolvimento de uma tecnologia precursora de sistemas modernos de comunicação.",
        details:
            "Hedy Lamarr foi uma atriz austríaca naturalizada norte-americana que também se dedicou à invenção e à tecnologia. Durante a Segunda Guerra Mundial, desenvolveu com George Antheil uma técnica de comunicação por salto de frequência destinada a dificultar a interferência em sistemas de orientação de torpedos. A patente registrada em 1942 apresentou uma ideia que posteriormente seria reconhecida como precursora de tecnologias utilizadas em sistemas modernos de comunicação sem fio."
    },

    {
        name: "Carolina Maria de Jesus",
        image: "./img/historical-figures/Carolina Maria de Jesus.png",
        description:
            "Escritora brasileira que registrou em sua obra experiências de pobreza, desigualdade e vida cotidiana.",
        details:
            "Carolina Maria de Jesus foi uma escritora brasileira que ganhou reconhecimento principalmente por seu livro 'Quarto de Despejo: Diário de uma Favelada', publicado em 1960. Moradora da favela do Canindé, em São Paulo, registrou em seus diários experiências de pobreza, fome, desigualdade e vida cotidiana. Sua obra tornou visíveis experiências sociais que muitas vezes eram ignoradas e tornou-se uma referência importante da literatura brasileira.",
        objectPosition: "center center"
    },

    {
        name: "Katherine Johnson",
        image: "./img/historical-figures/Katherine Johnson.png",
        description:
            "Matemática e cientista da NASA que teve papel fundamental nos cálculos das primeiras missões espaciais tripuladas dos Estados Unidos.",
        details:
            "Katherine Johnson foi uma matemática norte-americana que trabalhou na NASA e realizou cálculos essenciais para missões espaciais, incluindo a trajetória do voo de John Glenn. Seu trabalho contribuiu para o avanço da exploração espacial e para a presença de mulheres negras na ciência e na tecnologia."
    },

    {
        name: "Chiquinha Gonzaga",
        image: "./img/historical-figures/Chiquinha Gonzaga.png",
        description:
            "Compositora e maestrina brasileira pioneira na música popular e na atuação profissional de mulheres na música.",
        details:
            "Chiquinha Gonzaga foi uma compositora, pianista e maestrina brasileira que rompeu diversas barreiras sociais em uma época em que a atuação profissional das mulheres na música era limitada. Compôs obras para diferentes formações e teve papel importante na consolidação do choro e de outras formas da música popular brasileira. Também foi uma das primeiras mulheres a reger uma orquestra no Brasil e participou ativamente de movimentos sociais de seu tempo.",
        objectPosition: "center 30%"
    },

    {
        name: "Sonia Guimarães",
        image: "./img/historical-figures/Sonia Guimarães.png",
        description:
            "Física brasileira, reconhecida por sua trajetória acadêmica e por sua atuação na ciência e na educação.",
        details:
            "Sonia Guimarães é uma física brasileira que se tornou uma referência pela atuação na ciência, na educação e na formação de novas gerações de pesquisadores. Foi a primeira mulher negra brasileira a obter um doutorado em Física. Ao longo de sua carreira, também se dedicou ao ensino e à divulgação científica, tornando-se uma importante referência para a presença de mulheres negras nas áreas de ciência e tecnologia.",
        objectPosition: "center center"
    },

    {
        name: "Enedina Alves Marques",
        image: "./img/historical-figures/Enedina Alves Marques.png",
        description:
            "Engenheira brasileira e primeira mulher negra a se formar em Engenharia no Brasil, tornando-se referência na história da engenharia brasileira.",
        details:
            "Enedina Alves Marques foi uma engenheira civil brasileira e a primeira mulher negra a se formar em Engenharia no Brasil. Formada pela Universidade Federal do Paraná em 1945, enfrentou barreiras sociais e raciais para construir sua carreira em uma área predominantemente masculina. Trabalhou em projetos relacionados à infraestrutura do Paraná e tornou-se uma referência histórica para mulheres negras na engenharia e na ciência.",
        objectPosition: "center center"
    },

    {
        name: "Mae Jemison",
        image: "./img/historical-figures/Mae Jemison.png",
        description:
            "Médica, engenheira e astronauta norte-americana, conhecida por ser a primeira mulher negra a viajar ao espaço.",
        details:
            "Mae Jemison é uma médica, engenheira e astronauta norte-americana. Em 1992, tornou-se a primeira mulher negra a viajar ao espaço, ao participar da missão STS-47, a bordo do ônibus espacial Endeavour. Além de sua carreira na NASA, também atuou na área médica e, posteriormente, dedicou-se à educação científica e ao incentivo à participação de jovens nas áreas de ciência, tecnologia, engenharia e matemática."
    },

    {
        name: "Valentina Tereshkova",
        image: "./img/historical-figures/Valentina Tereshkova.png",
        description:
            "Cosmonauta soviética que se tornou a primeira mulher a viajar ao espaço, em 1963.",
        details:
            "Valentina Tereshkova foi uma cosmonauta soviética que, em 16 de junho de 1963, tornou-se a primeira mulher a viajar ao espaço. A bordo da Vostok 6, permaneceu quase três dias em órbita e realizou dezenas de voltas ao redor da Terra. Sua missão marcou um momento histórico na exploração espacial e abriu caminho para uma maior participação feminina em programas espaciais."
    },

    {
        name: "Angela Davis",
        image: "./img/historical-figures/Angela Davis.png",
        description:
            "Filósofa, escritora e ativista norte-americana conhecida por sua atuação na luta pelos direitos civis, igualdade racial e direitos das mulheres.",
        details:
            "Angela Davis é uma filósofa, escritora e ativista norte-americana que se tornou uma das principais referências dos movimentos pelos direitos civis e pela igualdade racial. Sua trajetória também está ligada à luta pelos direitos das mulheres, à crítica das desigualdades sociais e à defesa de mudanças no sistema prisional. Como professora e autora, produziu importantes estudos sobre raça, gênero, classe e justiça social.",
        objectPosition: "center center"
    },

    {
        name: "Malala Yousafzai",
        image: "./img/historical-figures/Malala Yousafzai.png",
        description:
            "Ativista paquistanesa conhecida mundialmente por defender o direito das meninas à educação.",
        details:
            "Malala Yousafzai tornou-se uma das principais vozes mundiais na defesa do direito à educação de meninas. Ainda adolescente, passou a denunciar as restrições impostas à educação feminina em sua região. Após sobreviver a um atentado em 2012, continuou sua atuação internacional pela educação. Em 2014, recebeu o Prêmio Nobel da Paz e tornou-se a pessoa mais jovem a receber a premiação.",
        objectPosition: "center center"
    },

    {
        name: "Emmeline Pankhurst",
        image: "./img/historical-figures/Emmeline Pankhurst.png",
        description:
            "Ativista britânica e uma das principais líderes do movimento sufragista pela conquista do direito ao voto feminino.",
        details:
            "Emmeline Pankhurst foi uma das principais líderes do movimento sufragista britânico. No início do século XX, ajudou a organizar campanhas que pressionavam o governo pela ampliação dos direitos políticos das mulheres. Fundou a Women's Social and Political Union, organização que utilizou manifestações e ações de desobediência civil para chamar atenção para a causa. Sua atuação tornou-se parte importante da história da conquista do voto feminino no Reino Unido.",
        objectPosition: "center center"
    },

    {
        name: "Wangari Maathai",
        image: "./img/historical-figures/Wangari Maathai.png",
        description:
            "Ambientalista e ativista queniana que uniu preservação ambiental, direitos das mulheres e desenvolvimento sustentável.",
        details:
            "Wangari Maathai foi uma ambientalista e ativista queniana que fundou o Green Belt Movement, iniciativa que incentivou o plantio de árvores e a participação das comunidades na preservação ambiental. Seu trabalho relacionou questões ambientais com direitos das mulheres, democracia e desenvolvimento sustentável. Em 2004, recebeu o Prêmio Nobel da Paz, tornando-se a primeira mulher africana a receber a premiação."
    },

    {
        name: "Dorothy Vaughan",
        image: "./img/historical-figures/Dorothy Vaughan.png",
        description:
            "Matemática e programadora norte-americana que trabalhou na NACA e na NASA, sendo pioneira na computação durante a corrida espacial.",
        details:
            "Dorothy Vaughan foi uma matemática norte-americana que trabalhou na NACA e posteriormente na NASA, durante um período marcado por segregação racial e fortes barreiras para mulheres negras. Tornou-se supervisora do grupo West Area Computing e posteriormente aprendeu a linguagem FORTRAN para acompanhar a transição dos cálculos manuais para a computação eletrônica. Seu trabalho contribuiu para a evolução dos métodos computacionais utilizados no programa espacial norte-americano.",
        objectPosition: "center 25%"
    },

    {
        name: "Elza Soares",
        image: "./img/historical-figures/Elza Soares.png",
        description:
            "Cantora brasileira que marcou a música popular brasileira com sua voz e sua trajetória de resistência.",
        details:
            "Elza Soares foi uma das maiores intérpretes da música popular brasileira. Nascida em uma família pobre no Rio de Janeiro, enfrentou dificuldades sociais e preconceitos ao longo de sua trajetória. Com uma carreira de várias décadas, transitou por samba, MPB, música eletrônica e outros estilos, reinventando sua sonoridade diversas vezes. Sua história também se tornou símbolo de resistência, especialmente pela maneira como enfrentou dificuldades pessoais e sociais sem abandonar sua carreira artística.",
        objectPosition: "center center"
    }

];

/* ------------------------------
    ELEMENTOS
------------------------------ */

/* ----- VIEWPORT ----- */

const carouselViewport =
    document.querySelector(".carousel-viewport");


/* ----- TRILHO ----- */

const carouselTrack =
    document.querySelector(".carousel-track");


/* ----- CONTROLES ----- */

const carouselPrev =
    document.getElementById("carousel-prev");

const carouselNext =
    document.getElementById("carousel-next");

const carouselPause =
    document.getElementById("carousel-pause");


/* ----- CONTADOR ----- */

const carouselCurrent =
    document.getElementById("carousel-current");

const carouselTotal =
    document.getElementById("carousel-total");


/* ------------------------------
    MODAL
------------------------------ */

/* ----- ELEMENTOS ----- */

const womanModal =
    document.getElementById("womanModal");

const womanModalClose =
    document.getElementById("womanModalClose");

const womanModalImage =
    document.getElementById("womanModalImage");

const womanModalTitle =
    document.getElementById("womanModalTitle");

const womanModalDescription =
    document.getElementById("womanModalDescription");

const womanModalDetails =
    document.getElementById("womanModalDetails");


/* ------------------------------
    SLIDES
------------------------------ */

/* ----- GERADOR ----- */

function criarSlides() {

    if (!carouselTrack) return;

    carouselTrack.innerHTML =
        women.map((woman) => {

            return `
                <div class="carousel-slot">

                    <article class="carousel-card">

                        <img
                            src="${woman.image}"
                            alt="${woman.name}"
                            ${woman.objectPosition
                    ? `style="object-position: ${woman.objectPosition};"`
                    : ""
                }
                        >

                        <div class="image-overlay"></div>

                        <h3>
                            ${woman.name}
                        </h3>

                        <p>
                            ${woman.description}
                        </p>

                        <button
                            class="carousel-source"
                            type="button"
                            data-woman="${woman.name}"
                        >
                            Saiba mais
                        </button>

                    </article>

                </div>
            `;

        }).join("");

}


/* ------------------------------
    EMBLA
------------------------------ */

/* ----- INICIALIZAÇÃO ----- */

criarSlides();


const autoplay =
    EmblaCarouselAutoplay({

        delay: 5000,

        stopOnInteraction: false,

        stopOnMouseEnter: true,

        stopOnFocusIn: true

    });


const embla =
    EmblaCarousel(
        carouselViewport,
        {
            loop: true,
            align: "center",
            containScroll: false
        },
        [
            autoplay
        ]
    );


/* ------------------------------
    ESTADOS
------------------------------ */

/* ----- ATUALIZAR CONTADOR ----- */

function atualizarContador() {

    if (!carouselCurrent || !carouselTotal) {
        return;
    }

    const index =
        embla.selectedScrollSnap();

    carouselCurrent.textContent =
        index + 1;

    carouselTotal.textContent =
        women.length;

}


/* ----- ATUALIZAR CARDS ----- */

function atualizarEstados() {

    const slides = [
        ...carouselTrack.querySelectorAll(".carousel-slot")
    ];

    const selecionado =
        embla.selectedScrollSnap();

    const total =
        slides.length;

    slides.forEach((slot, index) => {

        const card =
            slot.querySelector(".carousel-card");

        if (!card) return;

        const diferenca =
            Math.abs(index - selecionado);

        const distancia =
            Math.min(
                diferenca,
                total - diferenca
            );

        card.classList.remove(
            "active",
            "side"
        );

        if (distancia === 0) {

            card.classList.add("active");

        }

        if (distancia === 1) {

            card.classList.add("side");

        }

    });

}


/* ----- ATUALIZAR TUDO ----- */

function atualizarCarrossel() {

    atualizarContador();

    atualizarEstados();

}


/* ------------------------------
    NAVEGAÇÃO
------------------------------ */

/* ----- ANTERIOR ----- */

if (carouselPrev) {

    carouselPrev.addEventListener(
        "click",
        () => {

            embla.scrollPrev();

        }
    );

}


/* ----- PRÓXIMO ----- */

if (carouselNext) {

    carouselNext.addEventListener(
        "click",
        () => {

            embla.scrollNext();

        }
    );

}


/* ------------------------------
    AUTOPLAY
------------------------------ */

/* ----- PAUSAR / RETOMAR ----- */

if (carouselPause) {

    carouselPause.addEventListener(
        "click",
        () => {

            const autoplayApi =
                embla
                    .plugins()
                    .autoplay;

            if (!autoplayApi) return;


            const estaParado =
                carouselPause.getAttribute(
                    "aria-pressed"
                ) === "true";


            if (estaParado) {

                autoplayApi.play();

                carouselPause.setAttribute(
                    "aria-pressed",
                    "false"
                );

                carouselPause.classList.remove(
                    "playing"
                );

                carouselPause.setAttribute(
                    "aria-label",
                    "Pausar carrossel"
                );

            } else {

                autoplayApi.stop();

                carouselPause.setAttribute(
                    "aria-pressed",
                    "true"
                );

                carouselPause.classList.add(
                    "playing"
                );

                carouselPause.setAttribute(
                    "aria-label",
                    "Retomar carrossel"
                );

            }

        }
    );

}


/* ------------------------------
    EVENTOS
------------------------------ */

/* ----- MUDANÇA ----- */

embla.on(
    "select",
    atualizarCarrossel
);


/* ----- INICIALIZAÇÃO ----- */

atualizarCarrossel();


/* ------------------------------
    MODAL
------------------------------ */

/* ----- ABRIR ----- */

function abrirWomanModal(nome) {

    const woman =
        women.find(
            (item) => item.name === nome
        );

    if (!woman || !womanModal) {
        return;
    }


    if (womanModalImage) {

        womanModalImage.src =
            woman.image;

        womanModalImage.alt =
            woman.name;

    }


    if (womanModalTitle) {

        womanModalTitle.textContent =
            woman.name;

    }


    if (womanModalDescription) {

        womanModalDescription.textContent =
            woman.description;

    }


    if (womanModalDetails) {

        womanModalDetails.textContent =
            woman.details;

    }


    womanModal.classList.add(
        "active"
    );

}


/* ----- FECHAR ----- */

function fecharWomanModal() {

    if (!womanModal) return;

    womanModal.classList.remove(
        "active"
    );

}


/* ----- BOTÕES SAIBA MAIS ----- */

carouselTrack.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                ".carousel-source"
            );

        if (!button) return;

        const nome =
            button.dataset.woman;

        abrirWomanModal(nome);

    }
);


/* ----- BOTÃO FECHAR ----- */

if (womanModalClose) {

    womanModalClose.addEventListener(
        "click",
        fecharWomanModal
    );

}


/* ----- CLIQUE FORA ----- */

if (womanModal) {

    womanModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === womanModal
            ) {

                fecharWomanModal();

            }

        }
    );

}


/* ----- ESC ----- */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            womanModal &&
            womanModal.classList.contains("active")
        ) {

            fecharWomanModal();

        }

    }
);

/* =========================================================
   NAVBAR MOBILE
========================================================= */

/* ----- ELEMENTOS ----- */

const menuToggle = document.getElementById("menu-toggle");
const navbarMenu = document.getElementById("navbar-menu");


/* ----- ABRIR / FECHAR MENU ----- */

menuToggle.addEventListener("click", () => {

    const isOpen = navbarMenu.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
    );

});