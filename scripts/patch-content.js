/**
 * Patches all product JSON data files with human-written content.
 * Run: node scripts/patch-content.js
 */
const fs   = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT MAP  key = product type  value = { shortDesc, desc, metaDesc, tags }
// ─────────────────────────────────────────────────────────────────────────────

const CONTENT = {

  // ── PICKLES ──────────────────────────────────────────────────────────────

  Mango: {
    shortDesc: "Chunky raw mango pieces with Guntur red chilli, mustard powder and cold-pressed sesame oil. Made the old-fashioned way — no vinegar, nothing extra.",
    metaDesc:  "Classic Andhra avakaya with chunky raw mango, Guntur red chilli, mustard powder and cold-pressed sesame oil. No vinegar, no preservatives. 250g jar. Ships pan-India.",
    desc: `If you grew up in an Andhra household, you know what mango season really means. It's not just the fruit — it's the batches of avakaya that get made in May and June, the smell of sesame oil in the kitchen, and glass jars lined up on the shelf. Avakaya is one of those things that has its own place at the table. No other pickle quite does what it does.

We use raw mangoes that are firm and properly sour — cut into chunky pieces, not thin slices. Mixed with Guntur red chilli powder, roasted mustard seed powder, fenugreek, rock salt, turmeric and cold-pressed sesame oil. That's the whole ingredient list. No vinegar, no citric acid, no preservatives.

The way to eat this is simple: hot rice, one spoonful of avakaya on the side, a drizzle of ghee. The oil and spices melt into the rice, the mango holds its texture and gives that sharp sour note that no dal or rasam can replace. It works with curd rice too, and honestly even as a spread in a roti roll if you're up for it.

The spice builds slowly rather than hitting all at once. If you find it sharp, just mix a small piece into curd rice — that balances it immediately. One jar usually lasts a family a couple of weeks, depending on how much rice they eat.`,
    tags: ["avakaya", "andhra mango pickle", "avakaya pickle", "raw mango pickle", "andhra avakaya online", "mango pickle without vinegar", "sesame oil pickle", "andhra pickle"]
  },

  Gongura: {
    shortDesc: "Fresh sorrel leaves cooked down with garlic and Guntur chilli in sesame oil. Tangy, bold and deeply Andhra — the taste most people from the region miss the most.",
    metaDesc:  "Gongura pachadi made with fresh sorrel leaves, garlic, Guntur chilli and cold-pressed sesame oil. Tangy, bold and genuinely Andhra. No preservatives. Ships pan-India.",
    desc: `Gongura might be the one ingredient that every Andhra person, wherever they end up in India or abroad, genuinely misses. It has a sourness that nothing else can replace — not tamarind, not kokum, not raw mango. It's specific to the sorrel leaf, and when it's made into a pickle the right way, it makes everything else on the plate feel optional.

The way this pickle is made: fresh gongura leaves are cooked until soft, then mixed with garlic, Guntur red chilli, roasted mustard seeds, fenugreek and sesame oil. The garlic is important — it cuts through the aggressive tang of the leaves and brings the whole thing together. Without it, gongura can feel one-dimensional.

Eat this with plain steamed rice and a little ghee. It also works really well with dosa and pesarattu. If you've been to an Andhra restaurant and had gongura chicken or gongura mutton, the sourness in those dishes comes from a base exactly like this.

The flavour is bold. If you haven't eaten gongura before, start with a small amount on your rice. It grows on you fast.`,
    tags: ["gongura pickle", "gongura pachadi", "sorrel leaf pickle", "andhra gongura", "gongura online", "andhra sorrel pickle", "pulicha keerai pickle"]
  },

  Garlic: {
    shortDesc: "Whole garlic cloves slow-cured in Guntur red chilli, mustard powder and cold-pressed groundnut oil. The kind that makes plain rice feel like a complete meal.",
    metaDesc:  "Vellulli pachadi — whole garlic cloves slow-cured in Guntur red chilli, mustard, fenugreek and cold-pressed groundnut oil. Rich, pungent and genuinely good. Ships pan-India.",
    desc: `Garlic pickle is one of those things that doesn't need much explanation to anyone who has eaten it once. You open the jar, the smell hits you, and you know exactly what it's going to taste like with rice. It's strong, it's pungent, it's oily in a good way — the kind of oily that coats your rice and makes each grain taste different.

This is made with whole garlic cloves, not crushed or minced. The cloves absorb the spices over time and get slightly softer, while still holding their shape. The masala is Guntur red chilli, roasted mustard seed powder, fenugreek powder, turmeric and rock salt — all in cold-pressed groundnut oil. A little lemon goes in as the acidic balance.

Works best with plain steamed rice or dal rice. Some people also eat it with parathas, which is not traditional but genuinely works. If you cook a lot of curries, a small piece of this pickle added to the tempering actually changes the whole dish — the slow-cured garlic has a depth that raw garlic doesn't.

One note: this is not for the faint-hearted about garlic breath. It's a strong pickle. But it's also the best one to reach for when you're having a plain lunch and want something that makes the meal feel complete.`,
    tags: ["garlic pickle", "vellulli pachadi", "andhra garlic pickle", "lahsun ka achar andhra style", "garlic achar", "whole garlic pickle", "andhra achar"]
  },

  Ginger: {
    shortDesc: "Sliced ginger in Guntur red chilli and groundnut oil — sharp, warming and a little spicy. Good with rice, roti or even plain dosa.",
    metaDesc:  "Allam pachadi — sliced ginger slow-cured in Guntur red chilli, mustard, fenugreek and cold-pressed groundnut oil. Sharp, warming and distinctly Andhra. Ships pan-India.",
    desc: `Ginger pickle sits somewhere between a condiment and a digestive. It's the one pickle in Andhra cooking that people reach for not just because it tastes good but because they know it settles the stomach — especially during the colder months or when the stomach feels heavy after a big meal.

This is made with fresh ginger, sliced into pieces thick enough that you can taste the ginger and not just the masala. Marinated in Guntur red chilli, roasted mustard seed powder, fenugreek, turmeric, rock salt and cold-pressed groundnut oil. A little lemon goes in to keep the sourness balanced. The ginger softens in the oil over time and takes on the spices while keeping its own distinct bite.

On its own, it's strong. That's the point. You eat a small piece — maybe two or three bites — with rice or roti, not the whole jar in one sitting. It also works well as a side to upma or khichdi when you want something punchy to cut through the mild flavour.

In Andhra homes, allam pachadi is also made fresh as a chutney for dosa and idli — a smooth paste version with jaggery. This pickle version is different — it's the slow-cured, oil-based kind that keeps for months and gets better as it matures.`,
    tags: ["ginger pickle", "allam pachadi", "andhra ginger pickle", "adrak ka achar", "ginger achar", "homemade ginger pickle", "andhra pickle"]
  },

  RedChilli: {
    shortDesc: "Whole Guntur dried red chillies in sesame oil with mustard and tamarind. Extra hot, unapologetically Andhra.",
    metaDesc:  "Endu mirchi pachadi — whole Guntur dried red chillies in mustard, fenugreek and sesame oil. For those who take their spice seriously. No preservatives. Ships pan-India.",
    desc: `This pickle is not for everyone, and it doesn't pretend to be. It's made for people who grew up eating Andhra food at full heat, who find regular pickle "not spicy enough," and who understand that a small piece of this is all you need to transform a plate of plain rice.

The base is whole dried Guntur red chillies — the same variety used in most of Andhra's cooking and known for a heat that comes with flavour, not just fire. The chillies are combined with roasted mustard seed powder, fenugreek powder, rock salt, tamarind and cold-pressed sesame oil. The tamarind adds a slight sourness that balances the heat.

You eat a small piece at a time. Not a spoonful — a piece. It goes into plain rice with ghee, or alongside curd rice when you want to balance hot and cool together. Some people chop a small bit into a roti roll with onions. It also works as a flavour base if you're making a quick tadka for dal.

If you like your food genuinely spicy and you've been ordering "extra chilli" at restaurants your whole life, this is the pickle your kitchen needs.`,
    tags: ["red chilli pickle", "endu mirchi pachadi", "guntur chilli pickle", "andhra red chilli achar", "mirchi pickle", "spicy pickle andhra", "extra hot pickle"]
  },

  Lemon: {
    shortDesc: "Whole lemon pieces slow-cured in Guntur chilli and sesame oil. Sharp and sour — the one that goes best with curd rice.",
    metaDesc:  "Nimmakaya pachadi — whole lemon pieces slow-cured in Guntur chilli, mustard, fenugreek and sesame oil. Sharp, sour and very good with curd rice. Ships pan-India.",
    desc: `Lemon pickle has a different character from the other pickles in Andhra cooking. Where mango avakaya is chunky and rich, and gongura is deeply tangy and bold, lemon pickle is clean and sharp. The sourness comes from the lemon rind itself, which softens over time in oil and spices and takes on a slightly bitter edge that works really well with mild food.

This is made with whole lemons cut into pieces — rind included. The pieces cure in Guntur red chilli powder, roasted mustard seed powder, fenugreek, turmeric, rock salt and cold-pressed sesame oil over time. The longer the jar sits, the more the rind softens and the better the pickle gets.

The classic pairing is curd rice. The coolness of the curd, the sharpness of the lemon, the heat of the chilli — it's a very satisfying combination, especially for a simple lunch or a light evening meal. It also works well alongside dal rice or khichdi.

Fresh enough to be balanced, sharp enough to be interesting. This is a solid everyday pickle.`,
    tags: ["lemon pickle", "nimmakaya pachadi", "andhra lemon pickle", "nimbu ka achar andhra", "lemon achar without vinegar", "homemade lemon pickle", "andhra pickle"]
  },

  Tomato: {
    shortDesc: "Slow-cooked tomatoes with Guntur chilli, garlic and sesame oil. Tangy, slightly smoky and versatile enough to use beyond just rice.",
    metaDesc:  "Tomato pachadi Andhra style — slow-cooked tomatoes with Guntur chilli, garlic and sesame oil. Works as a pickle, a chutney and a curry base. Ships pan-India.",
    desc: `Tomato pickle in Andhra cooking is different from the versions you find in other parts of India. It's not smooth like a chutney, and it's not chunky like most pickles. It sits in between — cooked tomatoes that have broken down but still have texture, mixed with a spice base that brings in warmth and body.

This is made with ripe tomatoes slow-cooked with garlic, Guntur red chilli, mustard seeds, curry leaves, fenugreek and cold-pressed sesame oil. The tomatoes cook down and release their natural sourness, which means no added tamarind is needed. The result is a thick, jammy pickle that has both the freshness of tomato and the depth of cooked spices.

One reason this pickle is popular beyond just rice: it genuinely works as a cooking paste. A spoonful stirred into dal thickens it and adds a whole layer of flavour. Mix it into scrambled eggs in the morning and it becomes a completely different breakfast. If you're making a quick tadka rice, add a little of this instead of separate tomatoes and spices.

For kids in the family who find regular pickles too hot, tomato pickle is usually the one they'll eat without complaint — it's the most approachable of the Andhra pickles.`,
    tags: ["tomato pickle", "tomato pachadi", "andhra tomato pickle", "tamatar ka achar andhra", "tomato chutney pickle", "andhra condiment"]
  },

  Curry: {
    shortDesc: "Fresh curry leaves cooked down with tamarind, Guntur chilli and sesame oil. Earthy and fragrant — a pickle you can't find at most stores.",
    metaDesc:  "Karivepaku pachadi — fresh curry leaves slow-cooked in Guntur chilli, tamarind and sesame oil. Earthy, fragrant and unlike any other pickle. Ships pan-India.",
    desc: `Most people in India use curry leaves as a garnish — something added to the tadka and then pushed aside on the plate. In Andhra cooking, curry leaves are an ingredient in their own right, and this pickle is the clearest proof of that. When you slow-cook curry leaves with chilli, tamarind and sesame oil, they lose their bitterness and develop a deep, earthy flavour that's completely different from how they taste raw.

This is made with fresh curry leaves, dried slightly and then cooked down with Guntur red chilli, tamarind, mustard seeds, fenugreek and sesame oil. The tamarind adds sourness, the chilli adds heat, and the curry leaves give a warm, slightly medicinal quality that people either love immediately or take a few tries to appreciate.

The natural pairing is rice with ghee — simple, light, uncomplicated. It also works well as an accompaniment to upma or just spread on a dosa. Older generations in Andhra families often ate this pickle specifically because of the belief that curry leaves support digestion and hair health — whether that's proven or not, the pickle tastes good enough on its own.

This is not a common pickle — you won't find it at most stores. If you've been looking for karivepaku pachadi, this is the one.`,
    tags: ["curry leaves pickle", "karivepaku pachadi", "curry leaf achar", "andhra curry leaves pickle", "karivepaku pickle online", "andhra condiment"]
  },

  GreenChilli: {
    shortDesc: "Whole green chillies slow-cured in mustard and sesame oil. Fresh heat — sharper and brighter than dried red chilli pickles.",
    metaDesc:  "Pachimirchi pachadi — whole Andhra green chillies slow-cured in mustard, fenugreek and sesame oil. Fresh, fiery and excellent with dal rice. Ships pan-India.",
    desc: `Green chilli pickle has a different kind of heat from red chilli pickle. It's more immediate — hits the front of the tongue first and then fades faster. There's also a fresh, grassy note from the green chilli that you don't get with the dried red variety. People who eat this regularly say it opens up the palate before the rest of the meal.

This is made with whole Andhra green chillies — the thin, long variety, not the thick Shimla type. The chillies are cured in Guntur red chilli powder, roasted mustard seed powder, fenugreek, rock salt, turmeric and cold-pressed sesame oil. They soften slightly over time but hold their shape, which means you get both the texture of the chilli and the masala coating together.

Eat a whole piece alongside dal rice or sambar rice. You can bite into it fully, or just press it into the rice and let the spiced oil do the work. Some people eat this alongside curd rice specifically for the heat contrast with the cool curd.

This is extra hot. That's not a warning so much as a description of what it's supposed to be.`,
    tags: ["green chilli pickle", "pachimirchi pachadi", "hari mirch achar andhra", "andhra green chilli achar", "whole green chilli pickle", "spicy pickle"]
  },

  Amla: {
    shortDesc: "Indian gooseberry slow-cured in Guntur chilli and sesame oil. Sour, slightly bitter and good on both rice and its own.",
    metaDesc:  "Usirikaya pachadi — Indian gooseberry pickle with Guntur chilli, mustard and sesame oil. Sour, a little bitter, genuinely good for you. Ships pan-India.",
    desc: `Amla has a taste that takes a little getting used to — sour, astringent, slightly bitter, and then suddenly sweet in the aftertaste. As a pickle, all those qualities come together in a way that's genuinely interesting. People who grew up eating usirikaya pachadi in Andhra homes tend to love it. People encountering it for the first time often need a second try.

This is made with fresh Indian gooseberry (amla/usirikaya), cut into pieces, with Guntur red chilli powder, roasted mustard seed powder, fenugreek, rock salt, turmeric and cold-pressed sesame oil. The bitterness of the raw amla softens as it cures in the oil, but the sour and astringent notes remain — that's what the pickle is supposed to taste like.

It pairs best with plain rice and ghee — simple food that lets the complex flavour of the amla come through. It also works with curd rice and is surprisingly good alongside upma. Some families eat a small piece of amla pickle first thing in the morning as a habit, before the day's first meal.

Beyond taste, amla is naturally high in Vitamin C. This pickle keeps you connected to that without needing capsules.`,
    tags: ["amla pickle", "usirikaya pachadi", "gooseberry pickle", "andhra amla achar", "usirikaya pickle", "indian gooseberry pickle", "andhra condiment"]
  },

  Karela: {
    shortDesc: "Bitter gourd pieces cured in Guntur chilli and groundnut oil. Not for everyone, but deeply familiar if you grew up eating this.",
    metaDesc:  "Kakarakaya pachadi — bitter gourd slow-cured in Guntur chilli, mustard and cold-pressed groundnut oil. Strong, bitter, very Andhra. Good with rice. Ships pan-India.",
    desc: `Karela pickle is one of those foods that you either grew up eating and love, or you're trying for the first time and wondering what possessed anyone to pickle something this bitter. There's no middle ground, and that's fine. This pickle is made for people who know what kakarakaya pachadi is supposed to taste like.

Bitter gourd (kakarakaya in Telugu) is cut into thin rounds, lightly dried to reduce moisture, and then cured in Guntur red chilli powder, roasted mustard seed powder, fenugreek, rock salt, turmeric and cold-pressed groundnut oil. The bitterness doesn't go away — it's the whole point of the pickle. What the spices and oil do is round out the edges so the bitterness becomes rich rather than harsh.

In Andhra homes, this was a pickle kept specifically for older family members who had been told by doctors to eat karela for blood sugar management. Over time it became part of the regular rotation. Eat a small piece alongside dal rice or sambar rice. It cuts through the mild, starchy flavour of the rice in a way that the sweeter or sourer pickles don't.

If you've been looking for a genuine kakarakaya pachadi that tastes like the one your nana or thatha used to have, this is close.`,
    tags: ["karela pickle", "kakarakaya pachadi", "bitter gourd pickle", "karela achar", "andhra bitter gourd pickle", "kakarakaya pickle"]
  },

  Tamarind: {
    shortDesc: "Tamarind and jaggery cooked together with Guntur chilli and groundnut oil. Sweet-sour-spicy, all at once.",
    metaDesc:  "Chintakaya pachadi — tamarind and jaggery pickle with Guntur chilli, mustard and groundnut oil. Sweet, sour and spicy all at once. Ships pan-India.",
    desc: `Tamarind pickle is the most approachable of the Andhra pickles because it has all three things at once: sour from the tamarind, sweet from the jaggery and spicy from the Guntur chilli. It's the kind of pickle that people who "don't eat spicy food" often end up eating the most because the sweetness softens the heat.

This is made with whole tamarind, soaked and cooked with jaggery, Guntur red chilli, mustard seeds, fenugreek seeds, curry leaves, groundnut oil and hing. The tamarind and jaggery cook together and thicken into a paste that's rich but not heavy. Salt balances the sweetness.

It works with rice the same way other pickles do — a small spoonful alongside dal rice or plain rice with ghee. But it's also very good with roti and paratha because the sweet-sour combination works better with bread than some of the purely spicy pickles. Kids in the family usually take to this one faster than the hot mango or red chilli varieties.

If you've grown up eating imli chutney with chaat or pani puri, you already understand approximately what this tastes like — but the Andhra version is more complex and less sweet.`,
    tags: ["tamarind pickle", "chintakaya pachadi", "imli ka achar andhra", "tamarind jaggery pickle", "andhra tamarind pickle", "sweet sour pickle"]
  },

  Chicken: {
    shortDesc: "Tender chicken pieces slow-cooked in Guntur red chilli and sesame oil. The kind of pickle that turns plain rice into a full meal.",
    metaDesc:  "Andhra chicken pickle — tender chicken pieces slow-cooked in Guntur red chilli, whole spices and sesame oil. Rich, meaty and deeply spiced. 250g jar. Ships pan-India.",
    desc: `Non-vegetarian pickles from Andhra are a whole different category from the vegetable pickles. Where veg pickles rely on the natural sourness of their main ingredient, meat pickles are built on the cooking process — slow heat, deep spicing, good oil. A well-made chicken pickle has a richness that no vegetarian pickle can match.

This chicken pickle is made with boneless chicken pieces cooked in Guntur red chilli, coriander, cumin, turmeric, ginger, garlic, and cold-pressed sesame oil. The chicken cooks until it's tender and absorbs the spices fully. The oil, now flavoured with all the spices, coats the pieces and acts as both a preservative and a flavour carrier.

Eat it the same way you'd eat any pickle — a small portion alongside rice. The ratio matters: a lot of rice, a small amount of the pickle. The concentrated flavour of the pickle is the accent, not the main event. It also works as a stuffing for parathas, especially when the chicken pieces are broken up slightly and mixed with a little fresh coriander.

A jar of this in the fridge changes what plain rice can be. Long workdays, quick lunches, meals when you don't want to cook anything — this pickle does the job.`,
    tags: ["chicken pickle", "andhra chicken pickle", "chicken achar andhra", "murgh ka achar", "non veg pickle andhra", "chicken pickle online"]
  },

  Meat: {
    shortDesc: "Slow-cooked mutton pieces in Guntur chilli and sesame oil. Deeply spiced and rich — a little goes a long way with rice.",
    metaDesc:  "Andhra mutton pickle — slow-cooked tender mutton in Guntur chilli, whole spices and sesame oil. Deeply spiced, rich and genuinely satisfying with rice. Ships pan-India.",
    desc: `Mutton pickle is heavier and more intense than chicken pickle. Mutton has more fat and more flavour, and when it's slow-cooked in a proper Andhra spice base, it develops a depth that you can taste even in a small spoonful. This is the kind of thing people bring back from Andhra in their luggage when they visit family, or order online when they can't visit.

This is made with tender mutton pieces cooked low and slow in Guntur red chilli, coriander, cumin, turmeric, ginger, garlic, black pepper and cold-pressed sesame oil. The mutton breaks down gradually and absorbs the spices all the way through. The oil, enriched by the cooking, holds the flavour together and keeps the pickle preserved.

Eat it with hot rice — plain rice works better than flavoured rice here because the pickle has enough going on by itself. Curd rice with a small piece of mutton pickle on the side is a complete meal. It also works inside parathas or stuffed into bread for a quick non-veg snack.

This is a pickle worth trying if you've only ever eaten the commercial store-bought versions. The mutton is actually tender, not dried out, which is the test of a well-made meat pickle.`,
    tags: ["mutton pickle", "andhra mutton pickle", "gosht ka achar andhra", "lamb pickle", "non veg andhra pickle", "meat pickle online"]
  },

  Prawns: {
    shortDesc: "Dried prawns in Guntur chilli, tamarind and sesame oil. The coastal Andhra way — intense, salty and very good with rice.",
    metaDesc:  "Royyala pachadi — dried prawns cooked in Guntur chilli, tamarind and sesame oil. The coastal Andhra way of pickling seafood. 250g jar. Ships pan-India.",
    desc: `Prawns pickle is a coastal Andhra thing. East Godavari, Krishna and Guntur districts have a long tradition of cooking with dried seafood — not just fresh fish, but dried prawns that concentrate in flavour and keep for months. The pickle form takes that concentration and makes it even more intense through spicing and oil.

This is made with small dried prawns cooked with Guntur red chilli, tamarind, garlic, mustard seeds, fenugreek, curry leaves and cold-pressed sesame oil. The tamarind adds sourness that complements the natural saltiness of the dried prawns. The prawns soften in the oil but keep a slight chew — they're not paste, they're pieces.

The flavour is strong and salty by design. You eat a small amount with plain rice or curd rice. It's particularly good with red boiled rice — the variety eaten commonly in coastal Andhra — because the starchy sweetness of that rice balances the intensity of the pickle.

If you've grown up in a seafood-eating coastal family anywhere in India, this type of pickle will feel immediately familiar even if the Andhra spices are new to you. It's the kind of thing that makes a simple meal feel like home.`,
    tags: ["prawns pickle", "royyala pachadi", "shrimp pickle", "andhra prawns pickle", "dried shrimp achar", "seafood pickle andhra", "coastal andhra pickle"]
  },

  Fish: {
    shortDesc: "Fish pieces slow-cooked in Guntur chilli, fenugreek and sesame oil — coastal Andhra's most nostalgic pickle.",
    metaDesc:  "Chepala pachadi — Andhra-style fish pickle slow-cooked in Guntur chilli, fenugreek and sesame oil. Coastal taste in a jar. Ships pan-India.",
    desc: `Fish pickle from Andhra is not the same as fish pakoda or fried fish. It's a slow-cooked, oil-preserved preparation where the fish breaks down into the spice base and becomes something entirely different from fresh fish. People who haven't tried it often hesitate. People who have tried it tend to keep a jar in the fridge at all times.

This is made with small fish pieces, cleaned and cooked in Guntur red chilli, coriander, cumin, turmeric, ginger, garlic, fenugreek and cold-pressed sesame oil. The fenugreek is important — it gives fish pickle its characteristic slightly bitter, complex note that distinguishes it from other meat pickles. The fish cooks until it's tender and fully flavoured.

Eat it with hot rice and ghee. It's especially good alongside sambar rice or plain dal rice. Some coastal Andhra households also eat this pickle mixed into upma or rice porridge (kanji) for a heavy breakfast on cold mornings.

This is the kind of pickle that coastal families carry when they move to cities. Once you've grown up with it, you miss it specifically. If that's you, this is close to what you remember.`,
    tags: ["fish pickle", "chepala pachadi", "andhra fish pickle", "fish achar", "seafood pickle india", "coastal andhra pickle online"]
  },

  // ── PODI ─────────────────────────────────────────────────────────────────

  KandiPodi: {
    shortDesc: "Roasted toor dal powder with Guntur chilli, garlic and cumin. Mix it into hot rice with ghee — that's all you need.",
    metaDesc:  "Kandi podi made with roasted toor dal, Guntur chilli, garlic and cumin. The one powder every Andhra rice meal starts with. No fillers. Ships pan-India.",
    desc: `If you've ever eaten in an Andhra home, you know kandi podi. It's the first thing that comes out when rice is served. A spoonful goes into the rice, a drizzle of ghee follows, and you mix it all together before eating. It sounds simple. It is simple. It's also the kind of simple that you keep coming back to every day.

Kandi podi is made with roasted toor dal (split pigeon peas), Guntur red chilli, cumin, garlic, rock salt and hing. The toor dal gives body and a slightly nutty flavour when roasted properly. The garlic gives warmth. The Guntur chilli gives the heat that Andhra cooking is known for. Together they make a powder that turns plain rice into a complete meal.

The way to eat it: hot rice on the plate, one or two teaspoons of kandi podi, a teaspoon of cow ghee. Mix and eat. It's the Andhra equivalent of what dal rice is in North India — everyday, satisfying, never gets old. It also works mixed into curd rice to add flavour, or sprinkled over roti before rolling it up.

One jar usually lasts two to three weeks for a family of four, depending on how much rice they eat.`,
    tags: ["kandi podi", "andhra kandi podi", "toor dal podi", "gun powder andhra", "andhra rice powder", "kandi powder", "dal powder"]
  },

  IdlyPodi: {
    shortDesc: "Spicy Andhra karapodi with roasted chana dal, urad dal and Guntur chilli. The one your idli and dosa have been waiting for.",
    metaDesc:  "Karapodi made with roasted chana dal, urad dal, Guntur chilli and sesame seeds. The Andhra way to eat idli and dosa — no coconut chutney needed. Ships pan-India.",
    desc: `There's a reason almost every South Indian household has a jar of idly podi on the kitchen shelf. It's the quickest fix for a tiffin meal — idli comes out of the steamer, you dip it in podi mixed with sesame oil or ghee, and that's breakfast done. No grinding, no fresh chutney, no prep.

The Andhra version of idly podi — karapodi — is on the spicier end compared to Karnataka or Tamil Nadu versions. Roasted chana dal and urad dal form the base, Guntur red chilli gives the heat, sesame seeds add a nutty quality and mild fattiness, curry leaves add fragrance, and hing ties it together. The result is a powder that's more complex than it looks.

Mix it with a teaspoon of sesame oil or ghee and use it as a dip for idli. Spread it on a dosa before folding. Sprinkle it over pesarattu. It also works mixed into plain upma when you want a drier, spicier version of that dish.

If you've been using a store-bought idly podi that tastes mainly of salt and chilli, try this one. The roasted dal gives it a flavour that the commercial versions usually skip.`,
    tags: ["idly podi", "karapodi", "andhra idly podi", "chutney powder for idli", "dosa podi", "idli podi spicy", "andhra breakfast powder"]
  },

  NuvvulaPodi: {
    shortDesc: "Roasted sesame seed powder with Guntur chilli and garlic. Nutty and rich — very good on rice, and one of the more wholesome powders in the range.",
    metaDesc:  "Nuvvula podi made with roasted white and black sesame seeds, Guntur chilli and garlic. Nutty, calcium-rich and good on rice, dosa and roti. Ships pan-India.",
    desc: `Sesame seeds have a slightly sweet, nutty quality when roasted that makes nuvvula podi feel heavier and more filling than other podis. Where kandi podi is punchy and sharp, nuvvula podi is softer and more rounded. They complement each other well, which is why many Andhra households keep both.

This is made with roasted white and black sesame seeds, roasted chana dal, Guntur red chilli, garlic, cumin and rock salt. The sesame seeds are roasted carefully because they go bitter quickly if overcooked. Done right, the powder has a warmth that stays.

Mix it into hot rice with ghee. Sprinkle over roti. Use it as a dry dip for idli or dosa. Sesame seed powder also works really well mixed into lemon rice for a different texture.

Sesame seeds are naturally high in calcium, which is part of why this podi was traditionally given to new mothers and elderly family members in Andhra homes. Whether you eat it for the nutrition or just because it tastes good, either reason is fine.`,
    tags: ["nuvvula podi", "sesame seed powder", "til podi", "andhra sesame podi", "nuvvulapodi", "sesame chutney powder", "calcium rich podi"]
  },

  NalaKaram: {
    shortDesc: "Whole roasted Guntur red chillies ground with garlic and tamarind. This is what Andhra people mean when they say 'spicy podi.'",
    metaDesc:  "Nala karam — whole roasted Guntur red chillies ground with garlic, tamarind and cumin. The hottest dry chutney in Andhra. Not for mild eaters. Ships pan-India.",
    desc: `Nala karam translates loosely to "good spice" in Telugu, which is a classic example of understatement. This is the hottest dry chutney in Andhra cooking, and it's made for people who find regular karam podi too mild. It's not for everyone. It's not supposed to be.

This is made with whole Guntur red chillies — roasted, not raw — ground with roasted chana dal, garlic, cumin, coriander, rock salt and a small amount of tamarind to add sourness and balance. Whole roasted chillies have a different kind of heat compared to chilli powder — more complex, with a slight smokiness.

Use it the way you'd use any podi: on rice with ghee, with idli or dosa, mixed into upma. The difference is the quantity — a half teaspoon of nala karam goes as far as a full teaspoon of regular kandi podi. Start with less than you think you need.

It also works as a finishing powder. Sprinkle a small pinch over any dish at the table for an immediate heat boost. People who cook Andhra food regularly keep this alongside their regular podi specifically for this purpose.`,
    tags: ["nala karam", "andhra nala karam", "guntur chilli powder", "extreme spicy podi", "andhra hot chutney powder", "karam podi spicy", "fiery andhra powder"]
  },

  PeanutPodi: {
    shortDesc: "Roasted groundnut powder with Guntur chilli, garlic and tamarind. Rich and filling — works on rice, dosa, roti and everything in between.",
    metaDesc:  "Pallilu podi made with roasted groundnuts, Guntur chilli, garlic and tamarind. Rich, nutty and filling — one of the most versatile podis in Andhra cooking. Ships pan-India.",
    desc: `Peanut podi is the most filling of all the Andhra powders. Groundnuts are protein-rich and fatty, which means a spoonful of this podi on rice actually satisfies in a way that lighter podis don't. It's not a coincidence that this was one of the first things packed by Andhra workers who left for cities — shelf-stable, nutritious, and able to make plain rice feel like a real meal.

This is made with roasted groundnuts, Guntur red chilli, garlic, cumin, tamarind, curry leaves and rock salt. The groundnuts are roasted until golden and the skins are loose. The garlic and tamarind add sharpness to balance the richness of the peanut. The result is a thick, slightly coarse powder that has body.

Mix into hot rice with ghee or oil. Use as a dry dip for idli. Spread onto dosa before rolling. It also works mixed into a vegetable stir-fry at the end for a dry coating — a classic use in Andhra cooking where a little pallilu podi gets mixed into stir-fried cabbage or raw banana.

Good for kids' tiffin boxes, long travel days, or anyone who needs an easy protein source in their meal without much cooking.`,
    tags: ["peanut podi", "pallilu podi", "groundnut chutney powder", "andhra peanut podi", "shenga podi", "pallipodi", "protein rich podi"]
  },

  CoconutPodi: {
    shortDesc: "Dry coconut powder with chana dal, Guntur chilli and curry leaves. Mildly spiced, fragrant — good for people who want a less intense podi.",
    metaDesc:  "Kobbari podi made with dry coconut, chana dal, Guntur chilli and curry leaves. Mildly spiced, fragrant and great for idli, dosa and rice. Ships pan-India.",
    desc: `Coconut podi is one of the gentler podis in the Andhra lineup. Where kandi podi and nala karam lean into heat and intensity, kobbari podi has a sweeter, milder character from the dry coconut. It's a good entry point for people who haven't tried Andhra podi before, and it's also the one that children in the family tend to eat without protest.

This is made with dry coconut (copra), roasted chana dal, Guntur red chilli, mustard seeds, curry leaves, garlic and rock salt. Dry coconut is used rather than fresh coconut specifically because it roasts without going rancid and keeps well. The curry leaves and mustard seeds are tempered before grinding, which gives the powder a fragrance you notice when you open the jar.

Works best with idli and dosa — mix with a little sesame oil or ghee and use as a dip. It's lighter than kandi podi for rice, so if you're eating multiple courses and don't want the rice course to feel too heavy, this is a good choice.

Also good for travel — because the coconut base is dry and the powder is stable, it keeps without refrigeration for the shelf life window and holds up well in hot weather.`,
    tags: ["coconut podi", "kobbari podi", "dry coconut chutney powder", "andhra coconut podi", "nariyal podi", "dry coconut powder andhra", "idli podi coconut"]
  },

  MoringaPodi: {
    shortDesc: "Dried drumstick leaves ground with roasted dal and Guntur chilli. Earthy, mildly bitter and packed with nutrients — the podi your grandmother always added to rice.",
    metaDesc:  "Moringa podi made with dried drumstick leaves, roasted dal, Guntur chilli and garlic. The most nutritious podi in the range — earthy and genuinely good on rice. Ships pan-India.",
    desc: `Moringa — drumstick leaves — has been eaten in South Indian homes for generations before it became a global superfood trend. Andhra families, especially in rural areas, would dry moringa leaves and grind them into powder to add to rice during the months when fresh greens weren't available. It was a practical solution to nutrition that happened to taste good.

This moringa podi is made with dried drumstick leaves, roasted toor dal, roasted chana dal, Guntur red chilli, garlic, cumin and rock salt. The dried leaves have a slightly earthy, mildly bitter taste that's different from other podis — it's the taste of a leafy green, concentrated. The dal and spices balance and round it out.

Mix into hot rice with ghee. The ghee is particularly good with this one because fat helps the body absorb the fat-soluble nutrients in moringa. Sprinkle over upma or add to a simple vegetable stir-fry as a finishing powder. Some people mix it into roti dough for an everyday nutrition boost.

This is not the sweetest-tasting podi in the range. If you're new to moringa, start with a smaller quantity mixed with kandi podi until you're used to the flavour. Once you're used to it, you'll find it becomes a regular.`,
    tags: ["moringa podi", "drumstick leaf powder", "murungai podi", "andhra moringa powder", "moringa rice powder", "moringa chutney powder", "murungakeerai podi"]
  },

  RedChilliGarlicPodi: {
    shortDesc: "Whole roasted Guntur chillies ground with raw garlic and chana dal. Bold and garlicky — this one has a strong character.",
    metaDesc:  "Vellulli karam made with whole roasted Guntur chillies, raw garlic and chana dal. Bold, garlicky and intensely hot — a classic Andhra spice powder. Ships pan-India.",
    desc: `Red chilli garlic podi is in the same heat territory as nala karam, but the garlic changes the character completely. Where nala karam is purely about the chilli, vellulli karam is about the combination of chilli and raw garlic — and that combination produces something pungent, warming and deeply satisfying in a way that single-note spice powders don't.

This is made with whole Guntur red chillies roasted and ground with raw garlic, roasted chana dal, cumin, rock salt and tamarind. The raw garlic is not pre-roasted, which means its sharp pungency comes through in the finished powder. The tamarind adds a slight sourness that cuts the intensity.

On hot rice with ghee, this powder transforms the meal completely. The garlic aroma opens up when it hits the warm rice, and the heat comes in behind it. It's also excellent on dosa and pesarattu — spread a little inside before folding. If you make any quick stir-fry or tadka vegetables, a small pinch of this at the end makes a big difference.

A word of warning: if you're in an office or a small apartment, the garlic smell from the jar will announce itself clearly. That's not a problem if you live alone. Adjust accordingly if you don't.`,
    tags: ["vellulli karam", "red chilli garlic podi", "andhra garlic podi", "garlic chilli powder", "vellulli karam podi", "hot garlic powder andhra"]
  },

  KakarakayaPodi: {
    shortDesc: "Dried bitter gourd ground with roasted dal, Guntur chilli and tamarind. Earthy and slightly bitter — the podi you eat because you know your body needs it.",
    metaDesc:  "Kakarakaya podi made with dried bitter gourd, roasted dal, Guntur chilli and tamarind. A genuinely unique podi — earthy, a little bitter and good on rice. Ships pan-India.",
    desc: `Bitter gourd powder is a niche product even within Andhra cooking — not every family makes it, and it's almost impossible to find commercially. The people who seek it out are either the ones who grew up eating it, or the ones who've been told by a doctor or family elder that bitter gourd is good for blood sugar and digestion.

This kakarakaya podi is made with dried bitter gourd pieces, roasted chana dal, roasted urad dal, Guntur red chilli, cumin, garlic, tamarind and rock salt. The bitterness of the karela is present but mellowed by the roasting process and the dal base. It's not as aggressively bitter as raw karela — more like a complex, slightly earthy powder.

Mix into hot rice with ghee. The bitterness works better with ghee than oil because the fat smooths it out. Start with a small amount — half a teaspoon — and increase gradually. Many people who claim to hate karela in any form will accept this powder once they've tried it a few times, because the texture and context are different from the vegetable itself.

Some people mix a small amount of this into their regular kandi podi to get the benefit of bitter gourd without eating it as a full meal component. That works.`,
    tags: ["kakarakaya podi", "bitter gourd powder", "karela podi", "andhra kakarakaya powder", "bitter gourd chutney powder", "karela rice powder"]
  },

  // ── SNACKS ────────────────────────────────────────────────────────────────

  Chegodi: {
    shortDesc: "Crispy rice flour rings with sesame seeds and cumin. The Andhra snack that vanishes from the plate before you notice.",
    metaDesc:  "Homemade Andhra chegodi — crispy rice flour rings with sesame seeds, cumin and Guntur chilli. The snack that shows up at every Andhra Sankranti table. Ships pan-India.",
    desc: `Chegodi has the kind of crunch that makes a sound. Not the soft crunch of baked things, but the sharp snap of rice flour done right in hot oil. It's a ring-shaped murukku — thicker and more substantial than the thin spiral chakli, with a texture that holds up well and doesn't turn soggy.

These are made with rice flour, sesame seeds, cumin, Guntur red chilli and a little butter to make the dough pliable. The rings are shaped by hand and deep-fried in clean oil until they're completely crisp. The sesame seeds toast in the frying and add their own nutty flavour to the finished snack.

In Andhra homes, chegodi shows up during Sankranti and Dasara — it's made in large batches at festival time and shared between families. Outside festival season, it's the snack you make when someone is coming over and you want something more interesting than store-bought chips.

Eat them plain with tea. Eat them as a before-meal snack. They keep well in an airtight container for two to three weeks.`,
    tags: ["chegodi", "andhra chegodi", "ring murukku", "rice flour chakli", "chegodi snack", "andhra festival snack", "chegodi online"]
  },

  Jantikalu: {
    shortDesc: "Spiral rice flour murukku with roasted gram and Guntur chilli. Crispy, savoury and very good with evening tea.",
    metaDesc:  "Crispy Andhra jantikalu — spiral murukku made from rice flour and roasted gram with Guntur chilli and sesame. The traditional tea-time snack. Ships pan-India.",
    desc: `Jantikalu is the Telugu word for what the rest of India calls chakli or murukku. The shape is the same — a spiral pressed through a mould — but the Andhra version has its own character. The addition of roasted gram flour gives the dough a slightly nutty flavour and makes the finished snack lighter than pure rice flour versions.

These are made with rice flour, roasted gram flour, Guntur red chilli, sesame seeds, cumin and a little butter. The dough is shaped through a star-shaped press into spirals and deep-fried to a uniform golden crunch. Done right, they snap cleanly. Underdone jantikalu are soft in the middle; overdone ones are bitter.

The classic pairing is hot tea or filter coffee. You break off pieces and eat them between sips. Some people eat jantikalu with sambar as a dunking snack, which sounds unusual but works because the murukku absorbs just enough sambar without fully dissolving.

Made in small batches the traditional way — no preservatives, no baked version. The crunch is the point, and only frying gives that.`,
    tags: ["jantikalu", "andhra murukku", "andhra chakli", "jantikalu snack", "rice flour murukku", "andhra tea time snack", "chakli andhra"]
  },

  ChallaMirchi: {
    shortDesc: "Green chillies marinated in buttermilk and sun-dried. Fry them quickly and eat alongside rice, dal or curd rice.",
    metaDesc:  "Andhra challa mirchi — thick green chillies marinated in buttermilk and sun-dried, then deep-fried to a crisp. Tangy, salty and fiery. Ships pan-India.",
    desc: `Challa mirchi is one of those preparations that seems unnecessary until you've eaten it. Thick green chillies, soaked in buttermilk and salt for a day or two, then sun-dried until they shrink and wrinkle. You fry them in a little oil until they puff up and crisp, and what you get is tangy, salty, crispy, fiery — all at once.

The buttermilk marinade does two things: it takes some of the raw heat out of the chilli and adds a mild lactic sourness that you can taste in the finished product. The salt goes all the way through. When you fry them, the moisture that remained inside releases quickly in the hot oil, and the chilli becomes almost hollow and very crunchy.

Eat these as a side with rice and dal — the way you'd eat a pickle, but crunchier. Curd rice with a fried challa mirchi on the side is a classic combination. Also good as an accompaniment to upma or khichdi.

To fry: a little oil in a pan, medium heat, drop in the chillies and cover immediately because they splatter. Sixty to ninety seconds, turn once. They're done when they've puffed and turned slightly darker. Eat immediately while hot and crisp.`,
    tags: ["challa mirchi", "andhra challa mirchi", "buttermilk dried chillies", "majjiga mirchi", "andhra fried chilli", "sun dried chilli andhra"]
  },

  DahiMirchi: {
    shortDesc: "Chillies marinated in fresh curd and sun-dried. Slightly tangier and more sour than challa mirchi — fry and eat alongside rice.",
    metaDesc:  "Andhra dahi mirchi — thick chillies marinated in fresh yogurt and sun-dried. Tangy and sour before frying, crispy and complex after. Ships pan-India.",
    desc: `Dahi mirchi and challa mirchi are cousins — both use marinated sun-dried chillies, both are fried before eating. The difference is the marinade. Where challa mirchi uses buttermilk, dahi mirchi uses full curd (dahi/perugu). Curd has more body and more lactic acid than buttermilk, which means the dried chillies end up slightly more sour and with a slightly denser texture.

The preparation is the same: thick green chillies soaked in fresh curd and salt, then sun-dried over several days until they're properly dehydrated. The result looks like small, wrinkled, slightly yellowed chillies. Don't be put off by how they look — what happens when you fry them is very different.

Fry in hot oil for sixty to ninety seconds. The chillies puff up quickly and turn crisp. The curd coating caramelises slightly in the oil and adds a depth you don't get with buttermilk alone. Eat immediately.

Serve alongside rice and dal, curd rice, or any simple Andhra meal. The tang from the curd marinade pairs particularly well with ghee-coated rice or the coolness of curd rice.`,
    tags: ["dahi mirchi", "andhra dahi mirchi", "curd marinated dried chilli", "yogurt chilli andhra", "perugu mirchi", "sun dried andhra chilli"]
  },

  Vadiyalu: {
    shortDesc: "Sun-dried pumpkin papads with spices. Fry them and eat alongside rice meals — light, crispy and very satisfying.",
    metaDesc:  "Andhra gumadkai vadiyalu — raw pumpkin papads sun-dried with spices. Fry or roast for a light, crispy side. A summer tradition from East Godavari. Ships pan-India.",
    desc: `Vadiyalu are a summer tradition in Andhra homes. When the heat of April and May arrives, families make batches of sun-dried papads from rice, moong dal, raw banana or pumpkin — spread thin, dried on cotton cloths on rooftops, stored in airtight containers and eaten through the rest of the year. Gumadkai (pumpkin) vadiyalu are among the most common.

These are made from raw pumpkin grated and mixed with rice flour, Guntur red chilli, cumin, hing and salt. Shaped into small rounds and sun-dried over several days in summer heat. Properly dried vadiyalu are firm and brittle.

To prepare: deep-fry in hot oil for about thirty seconds — they puff up almost immediately and turn very crisp. Or roast on a hot griddle with a few drops of oil. They double in size when fried. Eat immediately as a side with rice, sambar or rasam. They also work as a snack on their own, plain or with a small bowl of yogurt for dipping.

Vadiyalu are light in the way fried things made from vegetables are — not greasy, not heavy. They're the kind of side that makes a simple dal rice meal feel more complete without adding much work.`,
    tags: ["vadiyalu", "gumadkai vadiyalu", "pumpkin papad", "andhra vadiyalu", "sun dried papads andhra", "gummadikaaya vadiyalu", "andhra crispy side"]
  },

  BoondiMixture: {
    shortDesc: "Crispy gram flour boondi with peanuts, fried curry leaves and Guntur chilli. The snack bowl for tea time.",
    metaDesc:  "Andhra-style boondi mixture — crispy gram flour drops mixed with roasted peanuts, curry leaves and Guntur chilli. Ready to eat. Ships pan-India.",
    desc: `Boondi mixture is the most democratic snack — everyone eats it, at every age, in almost every part of India. The Andhra version is spicier than most, uses Guntur red chilli over regular chilli powder, and includes fried curry leaves which add a fragrance you don't find in commercial versions.

The boondi is made from gram flour batter passed through a perforated ladle into hot oil, which forms the small spherical drops. Fried until crisp, drained, and then mixed with roasted peanuts, fried curry leaves, Guntur red chilli powder, salt and a little turmeric. The peanuts add protein and body. The curry leaves are essential — they turn crispy in oil and bring a fragrance to the whole mix.

Eat this with tea or coffee in the evening. Keep a bowl out when guests arrive. Take it in a container for travel — it doesn't crumble, it doesn't go soggy if properly stored, and it's satisfying without being heavy.

The Guntur chilli heat makes this noticeably spicier than most commercial boondi mixture. That's deliberate.`,
    tags: ["boondi mixture", "andhra boondi mixture", "spiced boondi", "namkeen andhra", "gram flour snack", "peanut boondi mix", "andhra namkeen"]
  },

  CornflakesMixture: {
    shortDesc: "Crunchy cornflakes with peanuts, cashew bits, raisins and Guntur chilli. Light, quick and good at any time of day.",
    metaDesc:  "Andhra cornflakes mixture — crispy cornflakes with roasted peanuts, cashew bits, raisins and Guntur chilli spice. Light and crunchy. Ready to eat. Ships pan-India.",
    desc: `Cornflakes mixture became part of Indian snack culture through the South — specifically through the mixture tradition that's strong in Karnataka and Andhra. It takes the humble breakfast cornflake and turns it into something with heat, salt, crunch and a little sweetness from the raisins.

This version mixes cornflakes with roasted peanuts, cashew pieces, raisins, fried curry leaves, Guntur red chilli powder, salt, a little sugar and a touch of turmeric. The sweetness from the raisins and the mild sweetness of the cornflake itself balances the Guntur chilli heat well — this is probably the most balanced of the mixtures in terms of sweet-salty-spicy.

It's lighter than boondi mixture because cornflakes are not made from gram flour. The texture is different too — more delicate, more airy. Good for people who want something light in the evening without the heaviness of deep-fried snacks.

Take it in a snack box to work. Give it to kids who ask for something to munch. Keep a bag in the car for the road.`,
    tags: ["cornflakes mixture", "andhra cornflakes mixture", "spiced cornflakes", "cornflake snack india", "andhra namkeen cornflakes", "sweet spicy mixture"]
  },

  KajuRoasted: {
    shortDesc: "Premium cashews roasted with Guntur chilli and rock salt. The kind you can't stop eating.",
    metaDesc:  "Premium cashews roasted and spiced with Guntur red chilli, rock salt and a little lime. Crunchy, bold and genuinely better than plain cashews. Ships pan-India.",
    desc: `Plain roasted cashews are good. Cashews roasted with Guntur chilli and rock salt are a different experience. The heat from the chilli gets into the cashew as it roasts — not just a coating on the surface but actually into the nut — and the rock salt adds a clean mineral quality that table salt doesn't give.

These are made with whole cashews, roasted in small batches at controlled temperature. The Guntur chilli is added during roasting so it cooks into the nut. Rock salt and a little lime finish them off. No artificial flavouring, no MSG, no coating of starch or egg white.

The result is a spicy cashew that stays crunchy and doesn't have the sticky, powder-coated texture of most commercial spiced nuts. The chilli heat is real — not the mild kind — so if you're eating these for the first time, pace yourself.

Eat them as a snack on their own. Mix a handful into boondi mixture for extra richness. They go very well with a cold drink in the evening, which may be the most honest thing one can say about a food product.`,
    tags: ["roasted kaju", "andhra roasted cashews", "spiced cashews", "guntur chilli cashews", "roasted kaju andhra", "masala cashews", "kaju namkeen andhra"]
  },

  // ── SWEETS ────────────────────────────────────────────────────────────────

  Ariselu: {
    shortDesc: "Rice and jaggery deep-fried into golden rounds with sesame seeds. The Andhra sweet that belongs at every Sankranti table.",
    metaDesc:  "Andhra ariselu made with soaked rice ground into batter, unrefined jaggery and sesame seeds, deep-fried to a golden crunch. The Sankranti essential. Ships pan-India.",
    desc: `If there's one sweet that represents Andhra festivals, it's ariselu. Sankranti is incomplete without it. The smell of ariselu being made — rice batter frying in oil, jaggery caramelising — is one of those smells that people from Andhra associate with the most uncomplicated happiness.

Ariselu is made from raw rice soaked overnight, ground into a smooth paste, mixed with melted jaggery and a little ghee until the batter is thick and slightly sweet. Sesame seeds are mixed in. The batter is shaped into small rounds and deep-fried in oil until they're cooked through and golden on the outside. Pressed slightly to release excess oil and left to cool.

The outside is firm and slightly crisp. The inside is soft and dense with the flavour of jaggery and the faint nuttiness of sesame. Not too sweet — jaggery has a more complex sweetness than refined sugar and doesn't feel sharp or cloying.

These are best eaten at room temperature. They keep for about a week in an airtight container without refrigeration.`,
    tags: ["ariselu", "andhra ariselu", "rice jaggery sweet", "andhra sankranti sweet", "ariselu online", "traditional andhra sweet", "bellam ariselu"]
  },

  MadtaKaja: {
    shortDesc: "Kakinada's famous layered fried sweet with a honeycomb inside and sugar syrup coating. Nothing else in Indian sweets quite looks or tastes like this.",
    metaDesc:  "The original Kakinada Kaja — layers of crispy fried dough soaked in sugar syrup, honeycomb texture inside. A GI-protected Andhra sweet. Ships pan-India.",
    desc: `Kakinada Kaja is one of a kind. Made only in Kakinada, East Godavari district, it's a GI-tagged sweet that has a texture no other Indian mithai replicates — layers of fried dough that open up in the oil into a honeycomb structure, then soaked in sugar syrup. From the outside it looks like a golden cylindrical sweet. Cut it open and you see the layered interior like a wasp's nest. Bite into it and the crispy layers and the sweet syrup give you two textures at once.

The technique is the reason Kaja is made in Kakinada and barely anywhere else — the dough is rolled, folded repeatedly to create layers, then cut and fried in a specific way that causes the layers to separate and puff into the honeycomb shape. It requires practice and the right consistency of dough.

The syrup is sugar-based — this is the one sweet where jaggery doesn't work, because the crystalline structure of sugar is what gives the coating its characteristic dry-crisp finish.

Eat one piece at a time. They're sweet and rich and you don't need more than one or two. Good with black tea, good as a post-meal mithai, and good as a gift because the shape is striking and the story behind it is interesting to tell.`,
    tags: ["madta kaja", "kakinada kaja", "andhra kaja", "kakinada sweet", "GI tagged andhra sweet", "kaja mithai", "kaja sweet online"]
  },

  Sunundalu: {
    shortDesc: "Urad dal laddus with unrefined jaggery, ghee and cardamom. Filling and traditional — the kind that are made for new mothers and festival tables alike.",
    metaDesc:  "Sunundalu — Andhra urad dal laddus with unrefined jaggery, pure ghee and cardamom. Protein-rich, traditional and genuinely filling. Ships pan-India.",
    desc: `Sunundalu are one of the most traditional sweets in Andhra cooking, with a history that goes back to when sweets were also considered nourishing food rather than just dessert. Urad dal is protein-rich and considered warming in traditional cooking — sunundalu were, and still are, given specifically to new mothers in Andhra households after childbirth because of their nutritional density.

Made from roasted urad dal (black gram, skinned) ground into a fine powder, mixed with powdered jaggery, pure cow ghee and cardamom, rolled into laddus. The dal is roasted until it smells nutty and slightly toasted. The jaggery gives an earthy sweetness. The ghee binds everything together.

The texture is firm but not hard — it has the kind of solidity that tells you it was made properly. One laddu is filling in a way that most sweets aren't, because the dal and ghee together have real substance.

Sunundalu keep well in an airtight container at room temperature for about ten days. Good as a post-meal sweet, good as an energy food before a long day, and good as prasad during festival seasons like Dasara and Kartika Masam.`,
    tags: ["sunundalu", "urad dal laddu", "andhra sunundalu", "minapa sunnundalu", "ulundu laddu", "andhra laddu", "jaggery laddu andhra"]
  },

  Pootharekulu: {
    shortDesc: "Paper-thin rice starch sheets folded with jaggery, ghee and dry fruits. Made in Atreyapuram — a GI-tagged sweet that looks as remarkable as it tastes.",
    metaDesc:  "Pootharekulu from Atreyapuram — paper-thin rice starch sheets folded with jaggery, ghee and dry fruits. A GI-tagged Andhra delicacy. Ships pan-India carefully packed.",
    desc: `Pootharekulu translates to "leaf candy" — poutha meaning covered or wrapped, rekulu meaning sheets. The name describes exactly what this is: something wrapped in incredibly thin sheets. These sheets are made from rice starch paste spread onto the outside of a heated earthen pot, dried for seconds, peeled off, and layered with jaggery, ghee and dry fruits. Repeat several times until you have a multi-layered, almost translucent roll.

This process happens in Atreyapuram village in East Godavari, and it has for at least two centuries. The sweet has a GI tag (Geographical Indication), meaning the name "Atreyapuram Pootharekulu" is legally protected, recognising that the unique combination of the local water, the traditional technique and the specific rice variety used there produces a sweet that cannot be genuinely replicated elsewhere.

The taste is delicate. Rice starch by itself is mild — what you taste is the jaggery and ghee that the sheets are folded with, and the dry fruits inside. The texture is papery on the outside and soft inside where the filling is. It melts quickly.

Because of how they're made, these need careful handling and packaging. They're not as travel-hardy as a laddu or a chikki — they're fragile. We pack them specifically for this.`,
    tags: ["pootharekulu", "atreyapuram pootharekulu", "andhra rice paper sweet", "GI tagged andhra sweet", "poutha rekulu", "andhra paper candy", "rice starch sweet"]
  },

  GulabPuvu: {
    shortDesc: "Rose-shaped fried maida sweet dusted in powdered sugar. The sweet that comes out at Andhra celebrations and looks too good to eat.",
    metaDesc:  "Gulab puvu — rose-shaped Andhra fried sweet made from maida batter, dusted in powdered sugar. A festive tea-time snack from Andhra homes. Ships pan-India.",
    desc: `Gulab puvu means "rose flower" in Telugu, and one look at this sweet explains the name. It's made using a flower-shaped mould dipped in hot oil, then dipped into a maida batter, and returned to the oil — the batter clings to the mould in the shape of a rose and crisps up around it. When you lift it out, you have a delicate, hollow, flower-shaped fried sweet. Dust it in powdered sugar and it's done.

This is technically a fried sweet but it's very light — the batter is thin, the shape is hollow, and the whole thing weighs almost nothing. It has a brittle crunch and the mild sweetness of maida with sugar coating.

In Andhra homes, gulab puvu was the sweet made specifically for special occasions — Ugadi, Dasara, Sankranti — because of the effort involved in making it look right. It's not difficult exactly, but it requires patience.

Good as a standalone sweet, good with tea, good as part of a festival sweet spread. If you're sending a box of Andhra sweets to family in another city, gulab puvu is the one that makes them ask "where did you get this?"`,
    tags: ["gulab puvu", "rose cake", "andhra rose cake", "andhra gulab puvu", "fried sweet andhra", "andhra festival sweet", "rosette sweet"]
  },

  BellamGavalu: {
    shortDesc: "Small shell-shaped fried dough coated in jaggery syrup. Crunchy, sweet and the perfect size for a handful.",
    metaDesc:  "Bellam gavalu — small shell-shaped Andhra fried dough sweets coated in unrefined jaggery syrup. Crunchy outside, sweet all the way through. Ships pan-India.",
    desc: `Gavalu are shaped like small shells or cowries — the name gavalu in Telugu means cowries. The shape is made by pressing small pieces of dough against a fork or a ridged surface and rolling, creating the shell curve and the ridged pattern. Fried until golden. Then tossed in a hot jaggery syrup that coats each piece and sets into a crunchy, sweet shell.

This is the kind of sweet you make at home in a big batch because you can't stop eating them as you make them. The combination of the crispy fried dough and the dried jaggery coating creates a double crunch. The jaggery flavour is earthy and not cloying — it has that slight molasses note that refined sugar candy doesn't have.

Bellam gavalu are a festival essential — Diwali, Dasara, Ugadi all call for a batch. They also appear as a children's favourite at every Andhra household celebration because the small size and crunchy texture are immediately appealing.

Keep them in an airtight jar. They stay crunchy for about two weeks at room temperature.`,
    tags: ["bellam gavalu", "andhra gavalu", "jaggery shell sweet", "andhra bellam sweet", "gavalu sweet online", "andhra festival mithai"]
  },

  KajuChikki: {
    shortDesc: "Whole cashews set in jaggery brittle. Snaps cleanly, tastes real — no refined sugar.",
    metaDesc:  "Kaju chikki made with whole premium cashews and unrefined jaggery. No refined sugar, no glucose syrup. Snaps cleanly, tastes real. Ships pan-India.",
    desc: `Chikki is one of the simplest sweet preparations there is. Jaggery melted, mixed with nuts, poured thin and cooled. What changes is the quality of the jaggery and the quality of the nuts — those two things make all the difference between chikki that tastes like something from a street stall and chikki that you actually want to finish.

This kaju chikki uses whole cashews — not broken cashew bits, whole ones — and unrefined jaggery. The jaggery is cooked to the right temperature so the chikki snaps rather than bends. The ratio of cashews to jaggery is high, which means you're mostly eating cashew held together by jaggery, not the other way around.

No refined sugar. No glucose syrup added to keep it soft or extend shelf life. Just jaggery and cashews.

Good as a snack, good as a post-meal sweet, good in a lunchbox. If you've only eaten commercial chikki, try this version — the difference in the jaggery flavour is noticeable.`,
    tags: ["kaju chikki", "cashew chikki", "kaju brittle", "andhra kaju chikki", "cashew jaggery sweet", "kaju gur chikki", "jaggery cashew brittle"]
  },

  BoondiLaddu: {
    shortDesc: "Classic boondi laddu with gram flour drops, sugar syrup, cardamom and cashews. The one that shows up at every Indian celebration.",
    metaDesc:  "Classic boondi laddu — small gram flour drops fried and set with sugar syrup, cardamom and cashews. The laddu that shows up at every South Indian celebration. Ships pan-India.",
    desc: `Boondi laddu needs no introduction to anyone who has attended a South Indian wedding, puja or family gathering. It's the round, orange-yellow sweet that comes in a paper cone or a steel tray and disappears first. The version made at home, or by someone who learned to make it the old way, is different from the commercial version in subtle but meaningful ways — the ratio of boondi to syrup, the freshness of the cardamom, the texture of the cashews.

This is made with gram flour batter passed through a perforated ladle into hot oil to form small spherical drops. Fried, drained, tossed in sugar syrup that has been cooked to the right consistency, mixed with cardamom powder, broken cashews and raisins, and shaped into laddus while still warm. The syrup sets as the laddus cool.

Good boondi laddu holds its shape, doesn't crumble when you hold it, and isn't so sticky that it glues to the paper. The flavour is primarily cardamom and gram flour with the mild sweetness of sugar syrup.

This is a Diwali sweet, a wedding sweet, a birthday sweet, a prasad sweet. It's also just a good laddu to have on hand.`,
    tags: ["boondi laddu", "gram flour laddu", "andhra boondi laddu", "boondi ladoo", "besan laddu", "cardamom laddu", "indian festival sweet"]
  },

  MysorePak: {
    shortDesc: "Soft Mysore Pak with gram flour and pure ghee. The kind that melts before you finish chewing.",
    metaDesc:  "Soft-style Mysore Pak made with gram flour, sugar syrup and generous pure ghee. Melt-in-mouth texture, genuinely rich. Ships pan-India.",
    desc: `There are two kinds of Mysore Pak: the hard, fudge-like version and the soft version. The soft version is what most people mean when they say Mysore Pak is their favourite sweet. It has a texture that's simultaneously crumbly and fudgy, and it dissolves in the mouth quickly because of the high ghee content.

This is made with fine gram flour (besan), sugar syrup and generous amounts of pure ghee — more ghee than seems reasonable, which is exactly why it tastes the way it does. The besan is roasted in ghee and then the sugar syrup is added and the whole thing comes together into a thick, pourable mixture that sets into blocks as it cools. The characteristic pale yellow colour comes from the gram flour. The characteristic smell is roasted gram and ghee together.

Cut into squares or diamonds. Eat at room temperature. Don't refrigerate — the ghee solidifies in cold temperature and changes the texture.

One piece is enough for most people. That's not a small claim for a small sweet — it's just that the richness is real.`,
    tags: ["mysore pak", "milk mysore pak", "soft mysore pak", "andhra mysore pak", "besan sweet", "ghee sweet andhra", "gram flour mithai"]
  },

  DryFruitsLaddu: {
    shortDesc: "Dates, cashews, almonds, walnuts and jaggery pressed into laddus. No refined sugar, no flour — just good ingredients.",
    metaDesc:  "Dry fruits laddu with Medjool dates, cashews, almonds, walnuts and jaggery. No refined sugar, no maida, no syrup. Just nuts, dried fruit and jaggery. Ships pan-India.",
    desc: `This laddu is different from the others in the range because it doesn't involve any frying, no sugar syrup, and no binding agent beyond the natural stickiness of the dates and jaggery. It's made by blending Medjool dates with cashews, almonds, walnuts, and a small amount of jaggery, rolling into balls, and finishing with a coating of desiccated coconut or roasted sesame seeds.

The result is dense, sticky and intensely sweet from the dates — not from added sugar. The nuts give texture and richness. The jaggery adds a secondary sweetness and a slight earthy note.

This laddu was originally made in Andhra homes as a health food for children and elders — the kind of thing you gave to someone who needed nourishment between meals but wouldn't sit down for a full meal. It works as a breakfast on the run, as a post-workout snack, as a pre-travel food, or as a mid-afternoon energy fix.

Because there's no refined sugar and no flour, it's one of the few traditional Indian sweets that people with dietary restrictions around sugar can usually eat in moderation. One laddu is genuinely satisfying.`,
    tags: ["dry fruits laddu", "dates laddu", "dry fruit ladoo", "andhra dry fruits laddu", "no sugar laddu", "healthy indian sweet", "nuts and jaggery laddu"]
  },

  RavaLaddu: {
    shortDesc: "Roasted semolina laddus with ghee, cashews and cardamom. Light, fragrant and one of the easiest sweets to love.",
    metaDesc:  "Rava laddu made with roasted semolina, pure ghee, powdered sugar, cashews and cardamom. Fragrant, quick and the most everyday sweet in Andhra homes. Ships pan-India.",
    desc: `Rava laddu is the most approachable sweet in any Indian kitchen. It doesn't require special skills or equipment. It keeps well. It's not too sweet. Almost everyone eats it. In Andhra homes, it's the sweet that gets made when someone needs a laddu urgently — for an impromptu puja, for a festival that snuck up on you, for guests who arrived without notice.

Made with semolina (rava) roasted in ghee until it turns golden and fragrant, mixed with powdered sugar, broken cashews, raisins and cardamom. Ghee acts as the binder when the mixture is still warm — you shape laddus quickly before it cools and sets. The fragrance of ghee and cardamom together is the smell of rava laddu, and it's unmistakable.

The texture is grainy and slightly coarse in the best possible way — semolina retains its texture even in a laddu. It doesn't melt in the mouth the way Mysore Pak does; instead it dissolves gradually.

Keep these in an airtight container. They stay fresh at room temperature for about a week. Good as an after-meal sweet, good in a tiffin box, good at every festival.`,
    tags: ["rava laddu", "semolina laddu", "rava undalu", "andhra rava laddu", "sooji ladoo", "rawa ladoo", "ghee cashew laddu"]
  },

  GondLaddu: {
    shortDesc: "Roasted edible gum with dry fruits, ghee and jaggery. Made for winter and for recovery — the warming laddu that older generations always kept at home.",
    metaDesc:  "Gond katira laddu with roasted edible gum, dry fruits, ghee and jaggery. A traditional warming sweet — made for winter months and post-pregnancy nourishment. Ships pan-India.",
    desc: `Gond katira laddu is a seasonal sweet with a purpose. Gond (edible gum) is a resin collected from tree bark that puffs up dramatically when deep-fried in ghee — from a small hard pebble to a large porous foam ball that absorbs whatever flavour surrounds it. In laddu form, mixed with dry fruits, ghee and jaggery, it becomes a warming, energy-dense sweet that was traditionally prepared for winter consumption and for women recovering from childbirth.

This is made with roasted gond puffed in ghee, then mixed with roasted wheat flour, powdered jaggery, ghee, cashews, almonds, raisins, cardamom and dried ginger (sonth). The sonth and cardamom are important — they give warmth and help with digestion. This is an old recipe, the kind that grandmothers knew by ratio and feel rather than written measurement.

The texture is unlike other laddus — the puffed gond gives it a slightly crunchy, airy quality inside the dense laddu. The jaggery sweetness, ghee richness and dried ginger warmth make it a complex eating experience.

Eat one laddu in the morning with warm milk. Not two — one is enough. These are nourishing in a way that's meant to last through the morning. In winter especially, they're the kind of food that actually does what it claims.`,
    tags: ["gond laddu", "gond katira laddu", "edible gum laddu", "winter laddu", "gond ki ladoo", "andhra gond laddu", "post pregnancy laddu", "warming sweet"]
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

function patchFile(filePath) {
  const data    = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let   updated = 0;

  const patched = data.map(product => {
    const patch = CONTENT[product.type];
    if (!patch) {
      console.warn(`  ⚠  No content for type: ${product.type}`);
      return product;
    }
    updated++;
    return {
      ...product,
      shortDesc: patch.shortDesc,
      metaDesc:  patch.metaDesc,
      desc:      patch.desc,
      tags:      patch.tags,
    };
  });

  fs.writeFileSync(filePath, JSON.stringify(patched, null, 2), 'utf8');
  console.log(`  ✓  ${path.basename(filePath)} — patched ${updated}/${data.length} products`);
}

// ─────────────────────────────────────────────────────────────────────────────
// RUN
// ─────────────────────────────────────────────────────────────────────────────

const dataDir = path.join(__dirname, '..', 'data');

console.log('\nPatching product content…\n');
patchFile(path.join(dataDir, 'pickles.json'));
patchFile(path.join(dataDir, 'podi.json'));
patchFile(path.join(dataDir, 'snacks.json'));
patchFile(path.join(dataDir, 'sweets.json'));
console.log('\nDone.\n');
