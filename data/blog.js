/**
 * data/blog.js — Andhra Store blog posts
 *
 * Each post has:
 *   slug, title, metaTitle, metaDesc, category, publishDate, readMinutes,
 *   heroImage, heroAlt, contentImage, contentImageAlt, contentImageAfterBlock (index),
 *   intro, blocks (h2 | p | list | faq-intro), faq, relatedProducts, relatedCities
 */

export const BLOG_POSTS = [

  // ─── POST 1 ─────────────────────────────────────────────────────────────────
  {
    slug:        "what-is-avakaya",
    title:       "What is Avakaya? The Story Behind Andhra's Most Famous Pickle",
    metaTitle:   "What is Avakaya? Andhra Mango Pickle Explained | Andhra Store Blog",
    metaDesc:    "Avakaya is Andhra's iconic raw mango pickle — Guntur chilli, sesame oil, mustard seeds and no vinegar. Here is what it is, how it is made, and how to eat it.",
    category:    "Pickles",
    publishDate: "2026-05-27",
    readMinutes: 5,
    heroImage:   "/images/blog/avakaya-hero.jpg",
    heroAlt:     "Raw mango avakaya pickle in a dark ceramic bowl — chunky pieces with Guntur chilli masala and sesame oil",
    contentImage:    "/images/blog/avakaya-serving.jpg",
    contentImageAlt: "Avakaya mango pickle being served over curd rice — deep red chilli oil dripping from spoon",
    contentImageAfterBlock: 2,
    intro: "Avakaya is the pickle that defines Andhra Pradesh. Before any other dish, before any other preparation, ask someone from Andhra what food means to them and the word avakaya comes up. It is a raw mango pickle made with Guntur chilli powder, mustard seeds, fenugreek and sesame oil — and in its simplest form, it has been made the same way for centuries.",
    blocks: [
      {
        type: "h2",
        text: "What Makes Avakaya Different from Other Mango Pickles",
      },
      {
        type: "p",
        text: "North Indian mango pickle uses mustard oil and sometimes vinegar or brine as a preservative base. Andhra avakaya uses cold-pressed sesame oil — darker, nuttier and with a flavour strong enough to become part of the pickle rather than just a medium for the spices. The chilli is specifically Guntur red chilli, grown in Guntur district of Andhra Pradesh, which has a sharper and more direct heat than Kashmiri chilli.",
      },
      {
        type: "p",
        text: "The combination of raw mango's sourness, Guntur chilli's direct heat and sesame oil's nuttiness creates something that no other regional mango pickle replicates. There is no vinegar. No sugar. No stabilisers. Just the natural acidity of the mango, the heat of the chilli, and the oil that preserves everything.",
      },
      {
        type: "h2",
        text: "How Avakaya is Made",
      },
      {
        type: "p",
        text: "Raw mangoes are sourced in April and May when they are fully developed but still hard and completely unripe. The mangoes are washed, dried completely, and cut into large pieces — sometimes with the seed still attached. The seed piece is considered the best piece because the mango flavour concentrates there.",
      },
      {
        type: "p",
        text: "The masala is made from Guntur chilli powder, coarsely ground mustard seeds, salt and fenugreek. Everything is mixed with sesame oil and packed into ceramic jars. The pickle is left to cure for at least 10 to 15 days before eating. During this time the mango softens slightly, the masala infuses into each piece, and the oil absorbs the mango's natural acid.",
      },
      {
        type: "h2",
        text: "How to Eat Avakaya",
      },
      {
        type: "p",
        text: "Avakaya is not a condiment in the North Indian sense — a small chutney spooned on the side. In Andhra, it is a main component of the meal. A small piece of avakaya is mixed directly into hot rice with a spoonful of ghee — the heat of the rice releases the sesame oil and chilli aroma. This is called avakaya annam (avakaya rice) and it is a complete meal on its own.",
      },
      {
        type: "p",
        text: "Avakaya is also eaten with curd rice (perugu annam), where the cooling sourness of the curd balances the heat of the pickle. One piece of avakaya, one bowl of curd rice — this combination appears at the end of every Andhra meal. It is how the meal ends, not how it begins.",
      },
      {
        type: "h2",
        text: "What to Look for When Buying Avakaya",
      },
      {
        type: "p",
        text: "The oil should be sesame-based — not sunflower or refined vegetable oil. The mango pieces should be chunky, not minced or shredded. The colour should be a deep red-orange from real Guntur chilli, not a bright artificial red. There should be no vinegar in the ingredients list.",
      },
      {
        type: "p",
        text: "Real avakaya keeps for 6 to 12 months at room temperature in a sealed jar because the salt, oil and the mango's own natural acid act as preservatives. If a jar says it only lasts 3 months, the salt and oil ratio is probably off.",
      },
    ],
    faq: [
      {
        q: "What is avakaya made of?",
        a: "Raw mango, Guntur chilli powder, coarsely ground mustard seeds, fenugreek, salt and cold-pressed sesame oil. No vinegar, no refined oil, no sugar.",
      },
      {
        q: "How long does avakaya last?",
        a: "6 to 12 months in a sealed jar at room temperature. Longer if refrigerated. The salt and oil ratio determines shelf life — properly made avakaya does not need refrigeration.",
      },
      {
        q: "Is avakaya the same as mango pickle?",
        a: "Avakaya is a specific type of mango pickle from Andhra Pradesh. It is different from North Indian mango achaar in the oil used (sesame vs mustard), the chilli (Guntur vs Kashmiri), the texture (chunky vs finer) and the absence of vinegar.",
      },
    ],
    relatedProducts: [
      { href: "/pickles/andhra-mango-pickle",   label: "Andhra Mango Avakaya" },
      { href: "/pickles/andhra-gongura-pickle", label: "Gongura Pickle"        },
      { href: "/pickles/andhra-garlic-pickle",  label: "Andhra Garlic Pickle"  },
    ],
    relatedCities: [
      { href: "/andhra-pickles-hyderabad", label: "Pickles delivery in Hyderabad" },
      { href: "/andhra-pickles-bangalore", label: "Pickles delivery in Bangalore" },
      { href: "/andhra-pickles-delhi",     label: "Pickles delivery in Delhi"     },
    ],
  },

  // ─── POST 2 ─────────────────────────────────────────────────────────────────
  {
    slug:        "andhra-podi-guide",
    title:       "Podi — The Andhra Dry Spice Mix and How to Use It",
    metaTitle:   "Andhra Podi Guide — Types, Uses and What Each One Tastes Like | Andhra Store",
    metaDesc:    "Podi is the dry spice mix on every Andhra table. Kandi podi, nala karam, nuvvula podi, idly podi — here is what each one is and how to eat it.",
    category:    "Podi",
    publishDate: "2026-05-27",
    readMinutes: 5,
    heroImage:   "/images/blog/podi-hero.jpg",
    heroAlt:     "Four small terracotta bowls of different Andhra podi varieties — red, yellow, dark brown and green",
    contentImage:    "/images/blog/podi-serving.jpg",
    contentImageAlt: "Andhra podi sprinkled on hot steamed rice with a pool of golden ghee melting in",
    contentImageAfterBlock: 2,
    intro: "Podi is the dry spice mix that sits on every Andhra dining table alongside the pickle jar. If you have eaten at a South Indian restaurant and had something dark and spicy sprinkled on your idli or dosa, that was podi. But the home versions made in Andhra — kandi podi, nala karam, nuvvula podi — are different from restaurant versions and very different from each other.",
    blocks: [
      {
        type: "h2",
        text: "What is Podi?",
      },
      {
        type: "p",
        text: "Podi means powder in Telugu. It refers to any dry spice mix served with rice, idli, dosa, or used as a seasoning. Unlike chutneys, podi is dry and shelf-stable — a jar of good podi keeps for weeks or months. It is not a side dish. It is a flavour addition that makes simple food interesting without requiring cooking or preparation.",
      },
      {
        type: "p",
        text: "The classic way to eat podi with rice: hot rice in a bowl, a spoonful of podi, and a generous pour of ghee. Mix until the podi and ghee coat the rice evenly. That is avakaya annam's simpler cousin — and in Andhra homes, this combination appears at least three times a week.",
      },
      {
        type: "h2",
        text: "Kandi Podi — The Everyday Podi",
      },
      {
        type: "p",
        text: "Kandi podi is made from roasted toor dal (kandi pappu in Telugu) with dried red chillies, cumin and salt. It has a nutty, earthy flavour with moderate heat. The dal gives it a protein-rich depth that other podis do not have. This is the most commonly eaten podi in Andhra households — the one that is always on the table, the one that goes with everything.",
      },
      {
        type: "p",
        text: "Good kandi podi has a coarse texture, not a fine powder. The dal pieces should be visible. Fine-ground kandi podi loses the texture that makes it interesting with rice.",
      },
      {
        type: "h2",
        text: "Nala Karam — The Fiery One",
      },
      {
        type: "p",
        text: "Nala karam is the hot podi. Made with dried red chillies, garlic, cumin and salt — the garlic makes it pungent and the high chilli ratio makes it genuinely sharp. It is used in smaller quantities than kandi podi. The garlic flavour is prominent and it does not mellow over time the way raw garlic does — dried and blended into nala karam, it stays assertive.",
      },
      {
        type: "p",
        text: "Goes very well with pesarattu (green moong dosa), upma and as a seasoning mixed into cooked vegetables. Not for people who want mild heat.",
      },
      {
        type: "h2",
        text: "Nuvvula Podi — Sesame Spice Mix",
      },
      {
        type: "p",
        text: "Nuvvula means sesame in Telugu. Nuvvula podi is made with roasted sesame seeds, dried chillies, garlic and salt. The sesame gives it a nutty, slightly sweet depth that the other podis do not have — it is milder than nala karam and has a different flavour profile from kandi podi. Works well with rice and also as a topping on curries and sabzis.",
      },
      {
        type: "h2",
        text: "Idly Podi — What Restaurants Serve",
      },
      {
        type: "p",
        text: "The podi that comes with idli at restaurants is usually made from chana dal, urad dal, red chillies and sesame. Andhra-style idly podi tends to be hotter than Tamil Nadu versions. The traditional way to eat it: mix a spoonful of podi with sesame oil in a small bowl, and dip the idli into it. The oil softens the podi slightly and makes it cling to the idli surface.",
      },
    ],
    faq: [
      {
        q: "What is the difference between podi and chutney?",
        a: "Podi is dry and shelf-stable — it keeps for weeks without refrigeration. Chutney is wet and needs refrigeration, typically lasting 3 to 5 days. Podi is made from roasted and ground dry ingredients. Chutney is made from fresh or cooked ingredients blended with water.",
      },
      {
        q: "How do you eat podi with rice?",
        a: "Put hot rice in a bowl, add a spoonful of podi, pour ghee generously, and mix until the podi coats the rice. Start with a small amount of podi — it is concentrated and a little goes a long way.",
      },
      {
        q: "What is kandi podi made of?",
        a: "Roasted toor dal (split pigeon peas), dried red chillies, cumin and salt. Some recipes add a small amount of tamarind or asafoetida.",
      },
      {
        q: "Which podi is least spicy?",
        a: "Nuvvula podi (sesame podi) is typically the mildest. Kandi podi is moderate. Nala karam and moringa podi are the hottest.",
      },
    ],
    relatedProducts: [
      { href: "/podi/andhra-kandi-podi",          label: "Kandi Podi"   },
      { href: "/podi/andhra-idly-podi",            label: "Idly Podi"    },
      { href: "/podi/andhra-nala-karam",           label: "Nala Karam"   },
      { href: "/podi/andhra-nuvvula-podi",         label: "Nuvvula Podi" },
      { href: "/podi/andhra-moringa-podi",         label: "Moringa Podi" },
    ],
    relatedCities: [
      { href: "/andhra-pickles-pune",       label: "Andhra food delivery in Pune"      },
      { href: "/andhra-pickles-ahmedabad",  label: "Andhra food delivery in Ahmedabad" },
    ],
  },

  // ─── POST 3 ─────────────────────────────────────────────────────────────────
  {
    slug:        "pootharekulu-atreyapuram",
    title:       "Pootharekulu: The Paper Sweet from Atreyapuram That Has a GI Tag",
    metaTitle:   "Pootharekulu — Atreyapuram's GI-Tagged Paper Sweet | Andhra Store Blog",
    metaDesc:    "Pootharekulu are paper-thin rice starch rolls made only in Atreyapuram, East Godavari. Here is how they are made, why they have a GI tag, and how to eat them.",
    category:    "Sweets",
    publishDate: "2026-05-27",
    readMinutes: 5,
    heroImage:   "/images/blog/pootharekulu-hero.jpg",
    heroAlt:     "Three pootharekulu rice paper rolls on dark teak board — translucent outer layer showing dry fruit filling",
    contentImage:    "/images/blog/pootharekulu-detail.jpg",
    contentImageAlt: "Hands unrolling a pootharekulu to reveal delicate translucent rice starch layers and dry fruit filling",
    contentImageAfterBlock: 2,
    intro: "Pootharekulu is arguably the most technically demanding sweet in Indian cuisine. It is made from paper-thin sheets of rice starch — so thin they are translucent — layered with powdered jaggery, ghee and dry fruits, then rolled into cylinders. It has been made exclusively in Atreyapuram village in East Godavari for over two centuries and now carries a GI tag that legally protects that origin.",
    blocks: [
      {
        type: "h2",
        text: "What Does Pootharekulu Mean?",
      },
      {
        type: "p",
        text: "Pootharekulu literally means coated sheets in Telugu. Pootha means coating or wrap, rekulu means sheets. The name describes the technique exactly: ultra-thin sheets of rice starch are made and wrapped around a filling. Each finished roll contains multiple layers of these sheets — you can see through the outermost one before you eat it.",
      },
      {
        type: "h2",
        text: "How Pootharekulu is Made",
      },
      {
        type: "p",
        text: "Rice is soaked, ground into a fine paste and cooked with water into a thin starch mixture. This starch is spread as a very thin layer onto the outer surface of a heated earthen pot. Within seconds it dries into a translucent film. This film is carefully peeled off and placed flat — the entire sheet is roughly the size of a dinner plate and less than a millimetre thick.",
      },
      {
        type: "p",
        text: "The sheet is dusted with powdered jaggery, brushed with ghee, and scattered with dry fruits. Another sheet goes on top, and the process repeats. Once several layers have been built up, the stack is rolled into a cylinder and sealed with ghee. A finished pootharekulu roll is white on the outside, with the jaggery and dry fruits visible as shadows through the translucent sheets.",
      },
      {
        type: "h2",
        text: "Why Atreyapuram and Nowhere Else?",
      },
      {
        type: "p",
        text: "The GI tag for Atreyapuram pootharekulu recognises that the specific combination of local water, the traditional technique passed down through families in Atreyapuram, and the specific short-grain rice variety used there produces sheets of a quality that cannot be replicated elsewhere. The water mineral content affects the starch consistency. The earthen pots used are specific to this region. The technique itself — the speed and confidence with which makers spread the starch and peel the sheet — is developed over years of practice.",
      },
      {
        type: "p",
        text: "GI tags are legal protections under Indian law. The name Atreyapuram Pootharekulu cannot be used for products made anywhere else. This means if you see pootharekulu labelled as being from Atreyapuram, the claim is protected and verifiable. Pootharekulu made in Hyderabad or Bangalore and labelled Atreyapuram-style would be a false claim.",
      },
      {
        type: "h2",
        text: "How to Store and Eat Pootharekulu",
      },
      {
        type: "p",
        text: "Pootharekulu are fragile. The rice paper sheets crack if mishandled, which is why they need specific packaging for shipping. Store in a cool, dry place — not refrigerated, because the cold makes the sheets more brittle. Shelf life is about a week at room temperature and two weeks refrigerated. Bring to room temperature before eating.",
      },
      {
        type: "p",
        text: "The flavour is delicate: mild rice starch, sweet jaggery and ghee, crunchy dry fruits in the middle. It melts quickly — the starch dissolves as soon as it touches the tongue. One roll is satisfying and two is enough. It is not a heavy sweet; it is a refined one.",
      },
    ],
    faq: [
      {
        q: "What is pootharekulu made of?",
        a: "Rice starch sheets made from ground rice paste, layered with powdered jaggery, ghee and dry fruits (cashews, almonds, raisins). No refined sugar, no artificial flavouring.",
      },
      {
        q: "Why does pootharekulu have a GI tag?",
        a: "The GI tag protects Atreyapuram pootharekulu as a geographically specific product. The quality of the rice starch sheets depends on the local water, the specific rice variety and the traditional technique — none of which can be genuinely replicated elsewhere.",
      },
      {
        q: "How long does pootharekulu last?",
        a: "About 1 week at room temperature and 2 weeks refrigerated. Handle carefully — the rice paper sheets are fragile and crack if bent or pressed.",
      },
    ],
    relatedProducts: [
      { href: "/sweets/pootharekulu", label: "Pootharekulu"   },
      { href: "/sweets/ariselu",      label: "Ariselu"         },
      { href: "/sweets/madta-kaja",   label: "Madta Kaja"      },
    ],
    relatedCities: [
      { href: "/andhra-pickles-hyderabad", label: "Andhra sweets delivery in Hyderabad" },
      { href: "/andhra-pickles-bangalore", label: "Andhra sweets delivery in Bangalore" },
      { href: "/andhra-pickles-surat",     label: "Andhra sweets delivery in Surat"     },
    ],
  },

  // ─── POST 4 ─────────────────────────────────────────────────────────────────
  {
    slug:        "andhra-sweets-guide",
    title:       "Andhra Sweets Guide — What Each One Is and What Makes It Different",
    metaTitle:   "Andhra Sweets Guide — Ariselu, Kaja, Pootharekulu & More | Andhra Store",
    metaDesc:    "A practical guide to Andhra sweets — festival sweets, GI-tagged ones, nourishing laddus and everyday sweets. What each one is and why it matters.",
    category:    "Sweets",
    publishDate: "2026-05-27",
    readMinutes: 6,
    heroImage:   "/images/blog/andhra-sweets-guide-hero.jpg",
    heroAlt:     "Flat lay of traditional Andhra sweets — ariselu, boondi laddus, madta kaja, bellam gavalu on dark stone",
    contentImage:    "/images/blog/andhra-sweets-guide-gift.jpg",
    contentImageAlt: "Traditional Indian gift box with assorted Andhra sweets — ariselu, kaja, pootharekulu, mysore pak",
    contentImageAfterBlock: 3,
    intro: "Andhra Pradesh has a distinct sweet tradition that is separate from North Indian mithai and from Tamil Nadu sweets. Andhra sweets tend to use jaggery rather than refined sugar, are often rice or dal based, and have a strong connection to specific festivals and seasons. Here is a practical guide to the main Andhra sweets.",
    blocks: [
      {
        type: "h2",
        text: "The Sankranti Essentials",
      },
      {
        type: "p",
        text: "Sankranti (January) is the harvest festival of Andhra and three sweets define it. Ariselu — flat discs of soaked rice batter with jaggery, fried and pressed with sesame seeds. Crispy outside, dense inside, earthy from the unrefined jaggery. The smell of ariselu frying is what Sankranti smells like to anyone who grew up in Andhra.",
      },
      {
        type: "p",
        text: "Sunundalu are urad dal laddus with jaggery and ghee. Dense, nutritious and genuinely filling — one laddu carries you through the morning. Bellam gavalu are shell-shaped fried dough pieces coated in jaggery syrup. Small, crunchy and impossible to stop eating once you start. All three are made in the same kitchen on the same day, and the combination of all three on a plate is what a Sankranti sweet tray looks like.",
      },
      {
        type: "h2",
        text: "The Two GI-Tagged Sweets",
      },
      {
        type: "p",
        text: "Madta Kaja is from Kakinada, East Godavari. Layered fried dough soaked in sugar syrup — the frying technique causes the layers to separate into a honeycomb structure. Cut it open and the interior looks like a wasp nest. Crispy layers, sweet syrup, two textures at once. The technique is unique enough that it is only genuinely made in Kakinada, which is why it has a GI tag.",
      },
      {
        type: "p",
        text: "Pootharekulu from Atreyapuram (same district) is made from paper-thin rice starch sheets rolled with jaggery, ghee and dry fruits. Translucent, fragile and unlike anything else in Indian sweets. Also GI-tagged — the quality of the rice starch sheets depends on Atreyapuram's specific water and technique.",
      },
      {
        type: "h2",
        text: "The Nourishing Sweets",
      },
      {
        type: "p",
        text: "Some Andhra sweets were designed to nourish rather than just sweeten. Gond laddu uses puffed edible gum (roasted in ghee) with dry fruits, whole wheat, jaggery and dried ginger. Made for winter and traditionally given to new mothers for warmth and recovery. Post delivery laddu is a specific formula of gond, ajwain, dried ginger, dry fruits and ghee — a centuries-old postpartum recovery food.",
      },
      {
        type: "p",
        text: "Dry fruits laddu uses Medjool dates, mixed nuts and jaggery — no flour, no frying, no refined sugar. The dates provide natural sweetness and binding. One laddu is genuinely satisfying as an energy snack.",
      },
      {
        type: "h2",
        text: "The Everyday Sweets",
      },
      {
        type: "p",
        text: "Boondi laddu, rava laddu and mysore pak are the most versatile Andhra sweets — appropriate at weddings, festivals, as prasad, as gifts and as everyday treats. Boondi laddu is fried gram flour drops set in cardamom sugar syrup — the South Indian wedding sweet, always present. Rava laddu is roasted semolina with ghee, sugar and cashews — the quickest sweet to make and the most forgiving. Soft Mysore pak is the richest — gram flour cooked in an abundance of pure ghee until fudgy. One piece is enough because the ghee content is genuinely high.",
      },
    ],
    faq: [
      {
        q: "Which Andhra sweets have GI tags?",
        a: "Two Andhra sweets carry Geographical Indication protection: Kakinada Madta Kaja (from Kakinada, East Godavari) and Atreyapuram Pootharekulu (from Atreyapuram, East Godavari). Both are unique preparations that cannot be genuinely replicated outside their regions of origin.",
      },
      {
        q: "Which Andhra sweet is best for gifting?",
        a: "Pootharekulu is the most visually striking and the most distinctly Andhra — good for someone who has not encountered it before. Madta Kaja is also a good gift because of its unusual appearance and the story behind it. For a larger gift box, a combination of ariselu, boondi laddu and kaju chikki covers different textures and sweetness levels.",
      },
      {
        q: "Do Andhra sweets use refined sugar?",
        a: "Most traditional Andhra sweets use jaggery (unrefined cane sugar) rather than refined white sugar. Exceptions include Madta Kaja (which uses refined sugar syrup — jaggery does not work for the required crystalline coating) and boondi laddu (sugar syrup). Most other sweets — ariselu, sunundalu, gavalu, gond laddu — are jaggery-based.",
      },
    ],
    relatedProducts: [
      { href: "/sweets/ariselu",          label: "Ariselu"          },
      { href: "/sweets/madta-kaja",        label: "Madta Kaja"       },
      { href: "/sweets/pootharekulu",      label: "Pootharekulu"     },
      { href: "/sweets/boondi-laddu",      label: "Boondi Laddu"     },
      { href: "/sweets/mysore-pak",        label: "Mysore Pak"       },
      { href: "/sweets/gond-katira-laddu", label: "Gond Laddu"       },
    ],
    relatedCities: [
      { href: "/andhra-pickles-hyderabad", label: "Andhra sweets delivery in Hyderabad" },
      { href: "/andhra-pickles-bangalore", label: "Andhra sweets delivery in Bangalore" },
      { href: "/andhra-pickles-delhi",     label: "Andhra sweets delivery in Delhi"     },
    ],
  },

  // ─── POST 5 ─────────────────────────────────────────────────────────────────
  {
    slug:        "andhra-vs-north-indian-pickle",
    title:       "Andhra Pickle vs North Indian Achaar — What is Actually Different",
    metaTitle:   "Andhra Pickle vs North Indian Achaar — Key Differences | Andhra Store Blog",
    metaDesc:    "Andhra pickle and North Indian achaar look similar but differ in oil, chilli, texture and heat. Here is a clear breakdown of what makes them different.",
    category:    "Pickles",
    publishDate: "2026-05-27",
    readMinutes: 5,
    heroImage:   "/images/blog/andhra-vs-north-pickle-hero.jpg",
    heroAlt:     "Two ceramic bowls side by side — Andhra mango pickle with thick red masala on left, North Indian achaar on right",
    contentImage:    "/images/blog/andhra-pickle-jar.jpg",
    contentImageAlt: "Open glass jar of Andhra mango pickle showing chunky pieces, thick red sesame oil masala and whole spices",
    contentImageAfterBlock: 2,
    intro: "Ask most people what mango pickle is and they describe the jarred achaar from the supermarket — mustard oil base, moderate heat, sometimes slightly sweet. Andhra avakaya is something else. The differences between Andhra-style pickles and North Indian achaar are specific, consistent, and worth understanding before you buy.",
    blocks: [
      {
        type: "h2",
        text: "The Oil",
      },
      {
        type: "p",
        text: "North Indian pickles use mustard oil — sharp, pungent and with its characteristic raw bite that softens with aging. Andhra pickles use sesame oil (nalla nune in Telugu), which is cold-pressed, darker and nuttier. Sesame oil has a stronger flavour that becomes part of the pickle rather than just a medium for the spices. When you open a jar of Andhra avakaya, the sesame oil smell is the first and most distinctive thing about it.",
      },
      {
        type: "p",
        text: "This is not a minor difference. The oil is present in every mouthful and it changes the entire character of the pickle. Andhra pickle tastes nutty and rich. North Indian pickle tastes sharp and pungent. Neither is better — they are genuinely different eating experiences.",
      },
      {
        type: "h2",
        text: "The Chilli",
      },
      {
        type: "p",
        text: "North Indian achaar uses Kashmiri chilli for colour and Deggi mirch for moderate, building heat — both give a bright red colour with a gentler spice profile. Andhra pickles use Guntur chilli, grown in Guntur district. Guntur chilli has a sharper, more direct heat that arrives quickly and builds. The colour from Guntur chilli is a deeper, darker red than Kashmiri.",
      },
      {
        type: "p",
        text: "Andhra pickles are structurally hotter than North Indian ones. This is not individual variation or bad batches — it is the chilli. If you are buying Andhra avakaya for the first time and you are used to North Indian pickle, start with a smaller amount than you think you need.",
      },
      {
        type: "h2",
        text: "The Texture",
      },
      {
        type: "p",
        text: "North Indian mango pickles tend to have smaller, more uniform pieces in a saucy, spreadable masala base. Andhra avakaya uses large chunks of raw mango — sometimes with the seed piece still included. The masala is dry and clings to each piece rather than forming a pourable sauce. You scoop a piece of mango, not a spoonful of sauce.",
      },
      {
        type: "p",
        text: "This means Andhra avakaya and North Indian achaar are used differently. Avakaya is mixed into rice directly — a piece broken apart and mixed through. North Indian achaar is more likely to be spooned onto the side of a thali as a condiment. Both are correct uses within their own food traditions.",
      },
      {
        type: "h2",
        text: "Andhra Pickles That Have No North Indian Equivalent",
      },
      {
        type: "p",
        text: "Gongura pickle is made from sorrel leaves (gongura in Telugu) — a sour, leafy green that grows specifically in Andhra and coastal Odisha. There is no North Indian equivalent. Gongura has a tartness that is different from mango sourness or lime sourness — it is more complex and less sharp. Gongura pickle is one of the most searched Andhra foods outside Andhra.",
      },
      {
        type: "p",
        text: "Andhra garlic pickle uses whole garlic cloves in sesame oil with Guntur chilli — deeper and more direct than the garlic notes you find in North Indian mixed achaar. Dahi mirchi pickle (pickled curd chillies) is another Andhra preparation that has no North Indian parallel — fresh chillies stuffed with spiced curd mixture and sun-dried.",
      },
    ],
    faq: [
      {
        q: "Is Andhra pickle hotter than North Indian pickle?",
        a: "Yes, structurally. Andhra pickles use Guntur chilli which has a sharper, more direct heat than Kashmiri or Deggi mirch used in most North Indian achaar. This is consistent across all Andhra pickle varieties, not just the spicy ones.",
      },
      {
        q: "What oil is used in Andhra pickles?",
        a: "Cold-pressed sesame oil (nalla nune). North Indian pickles typically use mustard oil. The difference in oil creates a fundamentally different flavour profile.",
      },
      {
        q: "What is gongura?",
        a: "Gongura is a sour leafy green (Hibiscus cannabinus, also called sorrel or kenaf) that grows in Andhra Pradesh and coastal Odisha. It is the base of gongura pickle and gongura chutney. There is no North Indian equivalent — the sour, complex flavour of gongura is specific to Andhra cuisine.",
      },
      {
        q: "Can I substitute North Indian pickle with Andhra pickle in recipes?",
        a: "In most uses, yes. For rice mixing (with curd rice or plain rice), Andhra avakaya works the same way as North Indian mango achaar. Be aware that the heat level will be higher and the flavour will be sesame-forward rather than mustard-forward.",
      },
    ],
    relatedProducts: [
      { href: "/pickles/andhra-mango-pickle",   label: "Andhra Mango Avakaya"  },
      { href: "/pickles/andhra-gongura-pickle", label: "Gongura Pickle"         },
      { href: "/pickles/andhra-garlic-pickle",  label: "Andhra Garlic Pickle"   },
      { href: "/snacks/dahi-mirchi",            label: "Dahi Mirchi"            },
    ],
    relatedCities: [
      { href: "/andhra-pickles-pune",      label: "Andhra pickles delivery in Pune"      },
      { href: "/andhra-pickles-delhi",     label: "Andhra pickles delivery in Delhi"     },
      { href: "/andhra-pickles-ahmedabad", label: "Andhra pickles delivery in Ahmedabad" },
    ],
  },

];

// Helper: look up a post by slug
export function getBlogPost(slug) {
  return BLOG_POSTS.find(p => p.slug === slug) || null;
}
