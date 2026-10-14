export type ResearchArea = {
  slug: string;
  number: string;
  title: string;
  question: string;
  summary: string;
  equation: string;
  topics: string[];
  selectedTitles: string[];
};

export type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: number;
  topic: "Theory" | "Learning" | "Systems" | "Science";
  href: string;
  bib?: string;
  code?: string;
  note?: string;
};

export type Person = {
  name: string;
  detail?: string;
  href?: string;
  scholar?: string;
  image?: string;
  year?: string;
};

export type PeopleGroup = {
  title: string;
  people: Person[];
};

export const researchAreas: ResearchArea[] = [
  {
    slug: "universal-information",
    number: "I",
    title: "Universal information processing",
    question: "What can be learned or compressed without knowing the source?",
    summary:
      "We develop universal schemes that adapt to individual sequences, with guarantees that connect probability assignment, compression, prediction, filtering, and generation.",
    equation: "ℓ(xⁿ) ≈ −log Q(xⁿ)",
    topics: ["Lempel–Ziv", "sequential probability", "filtering"],
    selectedTitles: [
      "A Family of LZ78-based Universal Sequential Probability Assignments",
      "The LZ78 Source",
      "Universal Discrete Filtering With Lookahead or Delay",
    ],
  },
  {
    slug: "information-computation",
    number: "II",
    title: "Information × computation",
    question: "Which bits matter when time, memory, or compute is scarce?",
    summary:
      "We study principled trade-offs between representation, accuracy, latency, and computational cost—from nonlinear transforms and model compression to real-time decision-making.",
    equation: "utility = f(bits, time, compute)",
    topics: ["rate–distortion", "efficient AI", "latency"],
    selectedTitles: [
      "Information-computation trade-offs in non-linear transforms",
      "Win Fast or Lose Slow",
      "GaussianVision",
    ],
  },
  {
    slug: "learning-generation",
    number: "III",
    title: "Learning and generation",
    question: "Can information-theoretic structure make generative models simpler?",
    summary:
      "We bring exact likelihoods, discrete processes, and universal compression into modern learning systems, seeking models that are both theoretically grounded and practically lightweight.",
    equation: "I(X;Y) = H(X) − H(X|Y)",
    topics: ["diffusion", "symbolic music", "multimodal learning"],
    selectedTitles: [
      "ItDPDM: Information-Theoretic Discrete Poisson Diffusion Model",
      "LZMidi: Compression-Based Symbolic Music Generation",
      "GaussianVision",
    ],
  },
  {
    slug: "science",
    number: "IV",
    title: "Information in science",
    question: "How do we keep the signal when scientific data overwhelms the channel?",
    summary:
      "We apply information-theoretic ideas to genomics, neural interfaces, sensing, and other scientific settings where the data are large, structured, and expensive to move.",
    equation: "signal ≫ bandwidth",
    topics: ["genomics", "neuroscience", "sensing"],
    selectedTitles: [
      "Genomic Data Classification via Universal Compression",
      "A Framework for Compressive On-Chip Action Potential Recording",
    ],
  },
];

export const publications: Publication[] = [
  {
    title: "A Poisson Transition and Bias Law for KSG Mutual-Information Estimation",
    authors: "Abhiram Gorle and Tsachy Weissman",
    venue: "Preprint · October 2026",
    year: 2026,
    topic: "Theory",
    href: "/papers/gorle-weissman-ksg-poisson-transition-2026.pdf",
    bib: "/papers/gorle-weissman-ksg-poisson-transition-2026.bib",
    note: "Mutual-information estimation",
  },
  {
    title: "A Framework for Compressive On-Chip Action Potential Recording",
    authors:
      "Pumiao Yan, Dante G. Muratore, E. J. Chichilnisky, Boris Murmann, and Tsachy Weissman",
    venue: "IEEE Transactions on Biomedical Engineering 73(5)",
    year: 2026,
    topic: "Science",
    href: "https://doi.org/10.1109/TBME.2025.3615514",
    note: "Neural recording",
  },
  {
    title: "Universal Discrete Filtering With Lookahead or Delay",
    authors: "Pumiao Yan, Jiwon Jeong, Naomi Sagan, and Tsachy Weissman",
    venue: "IEEE Transactions on Information Theory 72(1)",
    year: 2026,
    topic: "Theory",
    href: "https://arxiv.org/abs/2501.10609",
    note: "Universal filtering",
  },
  {
    title: "The LZ78 Source",
    authors: "Naomi Sagan, Amir Dembo, Matthew Ho, and Tsachy Weissman",
    venue: "IEEE Transactions on Information Theory",
    year: 2026,
    topic: "Theory",
    href: "https://arxiv.org/abs/2503.10574",
    note: "Compression theory",
  },
  {
    title:
      "GaussianVision: Vision-Language Alignment from Compressed Image Representations using 2D Gaussian Splatting",
    authors: "Yasmine Omri, Connor Ding, Tsachy Weissman, and Thierry Tambe",
    venue: "CVPR · Highlight",
    year: 2026,
    topic: "Learning",
    href: "https://openaccess.thecvf.com/content/CVPR2026/html/Omri_GaussianVision_Vision-Language_Alignment_from_Compressed_Image_Representations_using_2D_Gaussian_CVPR_2026_paper.html",
    note: "Vision + compression",
  },
  {
    title: "An Information-Theoretic Perspective on LLM Tokenizers",
    authors:
      "Mete Erdogan, Abhiram Rao Gorle, Shubham Chandak, Mert Pilanci, and Tsachy Weissman",
    venue: "arXiv:2601.09039",
    year: 2026,
    topic: "Learning",
    href: "https://arxiv.org/abs/2601.09039",
    note: "Language models",
  },
  {
    title: "Information-computation trade-offs in non-linear transforms",
    authors:
      "Connor Ding, Abhiram Rao Gorle, Jiwon Jeong, Naomi Sagan, and Tsachy Weissman",
    venue: "arXiv:2506.15948",
    year: 2025,
    topic: "Systems",
    href: "https://arxiv.org/abs/2506.15948",
    note: "Representation efficiency",
  },
  {
    title: "ItDPDM: Information-Theoretic Discrete Poisson Diffusion Model",
    authors:
      "Sagnik Bhattacharya, Abhiram Gorle, Ahsan Bilal, Connor Ding, Amit Kumar Singh Yadav, and Tsachy Weissman",
    venue: "NeurIPS",
    year: 2025,
    topic: "Learning",
    href: "https://arxiv.org/abs/2505.05082",
    note: "Discrete generation",
  },
  {
    title: "Win Fast or Lose Slow: Balancing Speed and Accuracy in Latency-Sensitive Decisions of LLMs",
    authors:
      "Hao Kang, Qingru Zhang, Han Cai, Weiyuan Xu, Tushar Krishna, Yilun Du, and Tsachy Weissman",
    venue: "arXiv:2505.19481",
    year: 2025,
    topic: "Systems",
    href: "https://arxiv.org/abs/2505.19481",
    code: "https://github.com/haokang-timmy/Win-Fast-or-Lose-Slow",
    note: "Latency-aware AI",
  },
  {
    title: "LZMidi: Compression-Based Symbolic Music Generation",
    authors:
      "Connor Ding, Abhiram Gorle, Sagnik Bhattacharya, Divija Hasteer, Naomi Sagan, and Tsachy Weissman",
    venue: "arXiv:2503.17654",
    year: 2025,
    topic: "Learning",
    href: "https://arxiv.org/abs/2503.17654",
    note: "Universal generation",
  },
  {
    title: "Genomic Data Classification via Universal Compression",
    authors:
      "Yasmine Omri, Naomi Sagan, Eugene Min, Heewoong Choi, Taesup Moon, and Tsachy Weissman",
    venue: "ISMB/ECCB",
    year: 2025,
    topic: "Science",
    href: "https://doi.org/10.21203/rs.3.rs-6363017/v2",
    note: "Genomics",
  },
  {
    title: "A Family of LZ78-based Universal Sequential Probability Assignments",
    authors: "Naomi Sagan and Tsachy Weissman",
    venue: "IEEE Transactions on Information Theory 72(4)",
    year: 2026,
    topic: "Theory",
    href: "https://arxiv.org/abs/2410.06589",
    note: "Universal probability",
  },
  {
    title: "Mutual Information Upper Bounds for Uniform Inputs Through the Deletion Channel",
    authors: "Federico Pernice, Berivan Isik, and Tsachy Weissman",
    venue: "IEEE Transactions on Information Theory 70(7)",
    year: 2024,
    topic: "Theory",
    href: "https://doi.org/10.1109/TIT.2024.3389925",
    note: "Channel theory",
  },
];

publications.sort((a, b) => b.year - a.year);

const scholarSearch = (name: string) =>
  `https://scholar.google.com/scholar?q=${encodeURIComponent(`author:"${name}"`)}`;

export const people = {
  phd: [
    {
      name: "Aayush Rajesh",
      detail: "Research summary forthcoming.",
      href: "https://aayush2003.github.io/",
      scholar: scholarSearch("Aayush Rajesh"),
      image: "/people/aayush-rajesh.jpg",
    },
    {
      name: "Abhiram Gorle",
      detail: "Research summary forthcoming.",
      href: "https://abhiram3001.github.io/",
      scholar: scholarSearch("Abhiram Rao Gorle"),
      image: "/people/abhiram-gorle.png",
    },
    {
      name: "Connor Ding",
      detail: "Research summary forthcoming.",
      href: "https://www.czsding.com/",
      scholar: scholarSearch("Connor Ding"),
      image: "/people/connor-ding.png?v=20260909",
    },
    {
      name: "Jiwon Jeong",
      detail: "Research summary forthcoming.",
      href: "https://www.linkedin.com/in/jiwon-jeong-865b2422b/",
      scholar: scholarSearch("Jiwon Jeong"),
      image: "/people/jiwon-jeong.png",
    },
    {
      name: "Matthew Ho",
      detail: "Research summary forthcoming.",
      href: "https://www.linkedin.com/in/ho-matthew-10",
      scholar: scholarSearch("Matthew Ho"),
      image: "/people/matthew-ho.jpg",
    },
    {
      name: "Naomi Sagan",
      detail: "Research summary forthcoming.",
      href: "https://www.linkedin.com/in/naomisagan/",
      scholar: scholarSearch("Naomi Sagan"),
      image: "/people/naomi-sagan.png?v=20260909",
    },
    {
      name: "Yasmine Omri",
      detail: "Research summary forthcoming.",
      href: "https://tambelab.stanford.edu/people/yasmine-omri",
      scholar: scholarSearch("Yasmine Omri"),
      image: "/people/yasmine-omri.jpg",
    },
  ] satisfies Person[],
  visitors: [
    {
      name: "Jaeseok Byun",
      detail: "Seoul National University",
      href: "https://sites.google.com/view/jaeseokbyun",
      scholar: scholarSearch("Jaeseok Byun"),
      image: "/people/jaeseok-byun-photo.png",
      year: "2025",
    },
    {
      name: "Hao Kang",
      detail: "Georgia Institute of Technology",
      href: "https://haokang-timmy.github.io/",
      scholar: scholarSearch("Hao Kang"),
      image: "/people/hao-kang.png",
      year: "2025",
    },
    {
      name: "Szymon Kobus",
      detail: "Imperial College London",
      href: "https://www.imperial.ac.uk/information-processing-and-communications-lab/people/szymon-kobus/",
      scholar: scholarSearch("Szymon Kobus"),
      image: "/people/szymon-kobus.jpg",
      year: "2025",
    },
  ] satisfies Person[],
  collaborators: [
    {
      name: "Amit Yadav",
      detail: "Collaborator · formerly Meta",
      href: "https://sites.google.com/view/amit-yadav/home",
      scholar: scholarSearch("Amit Kumar Singh Yadav"),
      image: "/people/amit-yadav.jpg",
    },
    {
      name: "Taesup Moon",
      detail: "Seoul National University",
      href: "https://ece.snu.ac.kr/en/research-faculty/faculty/fulltime?md=view&profid=p870",
      scholar: scholarSearch("Taesup Moon"),
      image: "/people/taesup-moon.jpg",
    },
    {
      name: "Thierry Tambe",
      detail: "Stanford University",
      href: "https://tambelab.stanford.edu/people/thierry-tambe",
      scholar: scholarSearch("Thierry Tambe"),
      image: "/people/thierry-tambe.jpg",
    },
  ] satisfies Person[],
};

export const formerPeople: PeopleGroup[] = [
  {
    title: "PhD · Primary advisees",
    people: [
      { name: "Berivan Isik", href: "https://www.linkedin.com/in/berivan-isik-439a3b122" },
      { name: "Jay Mardia", href: "https://sites.google.com/view/jaymardia/home" },
      { name: "Pulkit Tandon", href: "https://www.linkedin.com/in/pulkit-tandon-8621a3a8" },
      { name: "Meltem Tolunay", href: "https://www.linkedin.com/in/meltem-tolunay-278758127/" },
      { name: "Noah Huffman", href: "https://www.linkedin.com/in/noahhuffman" },
      { name: "Yihui Quek", href: "https://sites.google.com/view/yihui-quek/" },
      { name: "Shubham Chandak", href: "https://shubhamchandak94.github.io/" },
      { name: "Yanjun Han", href: "https://yanjunhan2021.github.io/index.html" },
      { name: "Himanshu Asnani", href: "http://www.himanshuasnani.com" },
      { name: "Asaf Cohen", href: "http://www.bgu.ac.il/~coasaf/Asaf_Cohens_homepage/Home.html" },
      { name: "Irena Fischer-Hwang", href: "https://irenatfh.github.io" },
      { name: "George Gemelos", href: "https://www.linkedin.com/in/george-gemelos-1977521/" },
      { name: "Shirin Jalali", href: "https://sites.google.com/site/shirinjalali/" },
      { name: "Jiantao Jiao", href: "https://people.eecs.berkeley.edu/~jiantao/" },
      { name: "Vinith Misra", href: "http://vinmisra.github.io/" },
      { name: "Albert No", href: "https://www.linkedin.com/in/albert-no-a6047071" },
      { name: "Idoia Ochoa", href: "http://idoia.ece.illinois.edu/" },
      { name: "Haim Permuter", href: "http://www.ee.bgu.ac.il/~haimp/index.html" },
      { name: "Kamakshi Sivaramakrishnan", href: "https://www.linkedin.com/in/kamakshisivaramakrishnan/" },
      { name: "Kedar Tatwawadi", href: "http://web.stanford.edu/~kedart/" },
      { name: "Kartik Venkat", href: "https://www.linkedin.com/in/kartik-venkat-b239547b" },
      { name: "Pumiao Yan", href: "https://www.linkedin.com/in/pumiao-yan/" },
    ],
  },
  {
    title: "PhD · Secondary advisees",
    people: [
      { name: "Alon Kipnis", href: "https://cs.idc.ac.il/~kipnis/" },
      { name: "Mainak Chowdhury", href: "http://web.stanford.edu/~mainakch/" },
      { name: "Yeow-Khiang Chia", href: "http://researcher.ibm.com/researcher/view.php?person=sg-ykchia" },
      { name: "Paul Cuff", href: "https://www.princeton.edu/~cuff/" },
      { name: "Alexandros Manolakos", href: "https://scholar.google.com/citations?user=i-g1zC0AAAAJ&hl=en" },
      { name: "Dmitri Pavlichin", href: "https://www.dmitripavlichin.com" },
      { name: "Styrmir Sigurjonsson", href: "https://www.linkedin.com/in/styrmir-sigurjonsson/" },
      { name: "Han-I Su", href: "https://www.linkedin.com/in/hanisu/" },
      { name: "Rui Zhang" },
      { name: "Lei Zhao" },
      { name: "Sagnik Bhattacharya", href: "https://www.linkedin.com/in/sagnik-bhattacharya-8316977a" },
    ],
  },
  {
    title: "Masters",
    people: [
      { name: "Qìngxī Mèng (孟庆熹)" },
      { name: "Yair Carmon", href: "http://scholar.google.com/citations?user=kTKmpT0AAAAJ&hl=en" },
      { name: "Oren Zeitli" },
      { name: "Divija Hasteer", href: "https://www.linkedin.com/in/divijahasteer/" },
    ],
  },
  {
    title: "Postdoctoral advisees",
    people: [
      { name: "Dmitri Pavlichin", href: "https://www.dmitripavlichin.com" },
      { name: "Dror Baron", href: "http://people.engr.ncsu.edu/dzbaron/" },
      { name: "Thomas Courtade", href: "http://www.eecs.berkeley.edu/Faculty/Homepages/courtade.html" },
      { name: "Mikel Hernaez", href: "https://scholar.google.es/citations?user=-mh8RQ8AAAAJ&hl=en" },
      { name: "Peng Liu" },
      { name: "Amir Ingber", href: "http://scholar.google.com/citations?user=0IkkBzQAAAAJ&hl=en" },
      { name: "Lele Wang", href: "https://sites.google.com/site/wanglele1986/" },
      { name: "Zhiying Wang", href: "http://faculty.sites.uci.edu/zhiying/" },
    ],
  },
  {
    title: "Collaborators",
    people: [
      { name: "Rami Atar", href: "http://webee.technion.ac.il/people/atar/" },
      { name: "Salman Avestimehr", href: "http://www-bcf.usc.edu/~avestime/Home.html" },
      { name: "Shraga I. Bross", href: "http://engineering.biu.ac.il/en/node/973" },
      { name: "Jun Chen", href: "http://www.ece.mcmaster.ca/~junchen/" },
      { name: "Thomas Courtade", href: "http://www.ece.berkeley.edu/Faculty/Homepages/courtade.html" },
      { name: "Amir Dembo", href: "http://www-stat.stanford.edu/~adembo/" },
      { name: "Yonina Eldar", href: "http://webee.technion.ac.il/people/YoninaEldar/index.php" },
      { name: "Abbas El Gamal", href: "http://isl.stanford.edu/~abbas/" },
      { name: "Vivek Farias", href: "http://web.mit.edu/vivekf/www/" },
      { name: "Andrea Goldsmith", href: "http://www-ee.stanford.edu/~andrea/" },
      { name: "Ankit Gupta", href: "http://www.math.wisc.edu/~gupta/" },
      { name: "Jae-Young Kim" },
      { name: "Young-Han Kim", href: "http://circuit.ucsd.edu/~yhk/" },
      { name: "Kittipong Kittichokechai", href: "https://www.kth.se/profile/6313/" },
      { name: "Amos Lapidoth", href: "http://people.ee.ethz.ch/~lapidoth/Amos_Lapidoth/Welcome.html" },
      { name: "Shie Mannor", href: "http://www.ece.mcgill.ca/~smanno1/" },
      { name: "Nuno Martins", href: "http://www.ece.umd.edu/meet/faculty/martins.php3" },
      { name: "Neri Merhav", href: "http://web.stanford.edu/~tsachy/papers/rt_cvx_sig_proc.html" },
      { name: "Ciamac Moallemi", href: "http://moallemi.com/ciamac/" },
      { name: "Andrea Montanari", href: "http://www.stanford.edu/~montanar/" },
      { name: "Chandra Nair", href: "http://chandra.ie.cuhk.edu.hk/" },
      { name: "Tobias J. Oechtering", href: "http://www.kth.se/ees/omskolan/organisation/avdelningar/commth/aboutct/people/publicprofile.php?KthID=u1qyrsku" },
      { name: "Erik Ordentlich", href: "https://scholar.google.com/citations?user=vMdZVmQAAAAJ&hl=en" },
      { name: "Stephanie Pereira" },
      { name: "Gadiel Seroussi", href: "http://www.msri.org/people/staff/gadiel/index.html" },
      { name: "Shlomo Shamai", href: "http://webee.technion.ac.il/people/shamai/" },
      { name: "Ilan Shomorony", href: "http://foie.ece.cornell.edu/~ilan/" },
      { name: "Mikael Skoglund", href: "http://www.ee.kth.se/~skoglund/" },
      { name: "Anelia Somekh-Baruch" },
      { name: "Rajiv Soundararajan", href: "https://webspace.utexas.edu/rs6454/index.html" },
      { name: "Yossef Steinberg", href: "http://www.graduate.technion.ac.il/Theses/Advisors.asp?Key=19697" },
      { name: "Han-I Su", href: "http://www.stanford.edu/~hanisu/" },
      { name: "Ben Van Roy", href: "http://www.stanford.edu/~bvr/" },
      { name: "Sergio Verdu", href: "http://www.princeton.edu/~verdu/" },
      { name: "Krishnamurthy Viswanathan", href: "http://www.hpl.hp.com/people/krishnamurthy_viswanathan/" },
      { name: "Marcelo Weinberger", href: "http://www.hpl.hp.com/research/info_theory/marcelo_bio.htm" },
      { name: "Golan Yona", href: "http://biozon.org/people/golan/" },
    ],
  },
];
