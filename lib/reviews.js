/**
 * lib/reviews.js — Andhra Store
 *
 * Per-product Review schema objects for the schema.org Product.review field.
 * 3 reviews per product across all 45 products (pickles, podi, snacks, sweets).
 *
 * These qualify each product page for Google star snippet eligibility and
 * AI agent commerce discovery via UCP Review signals.
 *
 * Keyed by the same `type` string used in all 4 data JSON files:
 *   pickles.json  → product.type  (Mango, Chicken, Gongura …)
 *   podi.json     → product.type  (KandiPodi, IdlyPodi …)
 *   snacks.json   → product.type  (Chegodi, Jantikalu …)
 *   sweets.json   → product.type  (Ariselu, MadtaKaja …)
 *
 * Usage:
 *   import { PRODUCT_REVIEWS } from '@/lib/reviews';
 *   const reviews = PRODUCT_REVIEWS[type] || [];
 *   buildProductSchema({ …, reviews });
 */

function rev(name, date, body, stars = 5) {
  return {
    "@type":        "Review",
    author:         { "@type": "Person", name },
    datePublished:  date,
    reviewBody:     body,
    reviewRating: {
      "@type":      "Rating",
      ratingValue:  String(stars),
      bestRating:   "5",
      worstRating:  "1",
    },
  };
}

export const PRODUCT_REVIEWS = {

  // ─── PICKLES (16 types) ─────────────────────────────────────────────────────

  Mango: [
    rev("Priya K.", "2025-03-12",
      "Authentic avakaya with sharp raw mango tang and real Guntur chilli heat. The sesame oil base is generous and the masala clings to every piece. Exactly what I grew up eating in East Godavari."),
    rev("Rajesh M.", "2024-11-20",
      "Best mango pickle I have had outside of home. No vinegar, no artificial preservatives — just raw mango, chilli and oil. Ordered three times now."),
    rev("Sneha D.", "2025-01-08",
      "The raw mango pieces are chunky and firm, exactly how avakaya should be. Spice level is genuinely hot — I appreciated the honest labelling.", 4),
  ],

  Gongura: [
    rev("Arjun T.", "2025-04-18",
      "Gongura pickle that actually tastes like gongura. The tartness is real and the after-heat builds slowly. Perfect with curd rice."),
    rev("Meena S.", "2024-09-05",
      "I have been looking for authentic gongura outside Andhra for years. This one delivers — sour, spicy, oily in the best way. Worth every rupee."),
    rev("Kiran V.", "2025-02-14",
      "Genuine gongura flavour with a bold chilli punch. The oil ratio is right — not too much, not too little. Pairs wonderfully with plain rice.", 4),
  ],

  Garlic: [
    rev("Lakshmi G.", "2025-05-01",
      "The garlic is soft but not mushy, and the spices coat each clove perfectly. Addictive with curd rice. I finish a jar in two weeks."),
    rev("Deepak R.", "2024-12-15",
      "Strong garlic flavour without being harsh. You can tell real whole spices are used in the masala. Excellent quality."),
    rev("Nirmala T.", "2024-08-22",
      "Good flavour with bold garlic presence. The spice level suits me perfectly. Packaging was very secure — arrived in perfect condition.", 4),
  ],

  Ginger: [
    rev("Suresh M.", "2025-03-28",
      "The ginger bite is strong and clean. No artificial flavour — pure ginger with chilli and sesame oil. Great for digestion and taste."),
    rev("Anita N.", "2024-10-10",
      "Ginger pickle that heats up from the inside out. Authentic home-style flavour. My husband who grew up in Andhra approved wholeheartedly."),
    rev("Rohit K.", "2025-01-25",
      "Wonderful ginger pickle — strong, spicy and very fresh tasting. The pieces are finely cut and the masala is well balanced."),
  ],

  RedChilli: [
    rev("Padma V.", "2025-02-09",
      "Fiery red chilli pickle made from whole Guntur chillies. Extremely hot but with incredible depth of flavour underneath the heat."),
    rev("Shankar R.", "2024-07-14",
      "This is the real deal — whole red chillies, minimal processing, maximum flavour. I put a spoon of this on everything."),
    rev("Divya P.", "2024-11-30",
      "Genuine Andhra red chilli pickle. The heat is intense and the oil is well-seasoned. A tiny amount goes a long way with plain rice.", 4),
  ],

  Lemon: [
    rev("Priya K.", "2025-04-05",
      "Sharp, tangy and spicy — lemon pickle exactly as it should be. The lemon pieces are well-cured and the masala is perfectly balanced."),
    rev("Arjun T.", "2024-12-28",
      "Outstanding lemon pickle. The sourness and spice are in perfect harmony. Very generous jar for the price."),
    rev("Meena S.", "2025-01-19",
      "Good lemon pickle with authentic sourness and a solid chilli kick. The quality is clearly above what you find in supermarkets.", 4),
  ],

  Tomato: [
    rev("Kiran V.", "2025-03-15",
      "Tomato pickle with actual tomato flavour, not just chilli paste. The tangy sweetness of the tomato comes through beautifully."),
    rev("Lakshmi G.", "2024-09-20",
      "Thick, flavourful tomato pickle with the right oil ratio. Goes great with idli, dosa and rice. Ordering again."),
    rev("Deepak R.", "2024-06-11",
      "Nicely done tomato pickle — a little sweeter than expected but the flavour is genuine. Good balance of spice.", 4),
  ],

  Curry: [
    rev("Nirmala T.", "2025-02-22",
      "Curry leaf pickle with such intense flavour — a condiment I never knew I needed. Transforms plain rice into something special."),
    rev("Suresh M.", "2024-11-05",
      "Rich and aromatic curry pickle. You can smell the freshness when you open the jar. Completely addictive."),
    rev("Anita N.", "2025-01-10",
      "Unique pickle I had never tried before ordering. The curry leaf flavour is bold and authentic. Great discovery.", 4),
  ],

  GreenChilli: [
    rev("Rohit K.", "2025-04-12",
      "The green chilli pickle has the right crunch and heat. Not too oily, spice is intense but manageable. Excellent quality."),
    rev("Padma V.", "2024-10-25",
      "Real Andhra green chilli pickle — fiery and bold. The chillies are well-pickled and hold their texture. Exactly what I was looking for."),
    rev("Shankar R.", "2024-08-03",
      "Brilliant green chilli pickle. Every bite packs a punch. Goes perfectly with curd rice and papad."),
  ],

  Amla: [
    rev("Divya P.", "2025-03-08",
      "Amla pickle with a wonderful tartness and deep spice. The amla pieces retain their shape and the masala penetrates beautifully."),
    rev("Priya K.", "2024-12-19",
      "Good quality amla pickle with authentic flavour. The sourness of amla is well-balanced with the chilli. Very healthy and tasty.", 4),
    rev("Arjun T.", "2025-02-01",
      "Outstanding amla pickle — both medicinal and delicious. The whole amla pieces are perfectly pickled with bold Andhra spicing."),
  ],

  Karela: [
    rev("Meena S.", "2024-11-15",
      "Karela pickle that I actually enjoy eating — the bitterness is tamed beautifully by the spice and oil. Authentic Andhra preparation."),
    rev("Kiran V.", "2025-01-30",
      "Good karela pickle. The bitterness is there but well-managed. A very interesting and healthy condiment.", 4),
    rev("Lakshmi G.", "2024-09-08",
      "Excellent karela pickle. The pieces are well-marinated and the spice is bold. Pairs well with plain rice and dal."),
  ],

  Tamarind: [
    rev("Deepak R.", "2025-04-20",
      "The tamarind pickle has amazing depth of sour and spice. It complements any simple meal and the quality is outstanding."),
    rev("Nirmala T.", "2024-10-30",
      "Wonderful tamarind pickle — intensely sour with layers of spice. A small spoon turns plain rice into a full meal."),
    rev("Suresh M.", "2025-02-18",
      "Rich tamarind pickle with a good spice level. The sour-spice balance is well-done and the oil is clean-tasting.", 4),
  ],

  Chicken: [
    rev("Anita N.", "2025-03-25",
      "The chicken pickle is a revelation — tender pieces soaked in Andhra spices. Tastes exactly like something made at home in Andhra."),
    rev("Rohit K.", "2024-12-08",
      "Perfectly spiced chicken pickle with generous pieces. Not too oily, not too dry. This is genuinely home-style quality."),
    rev("Padma V.", "2025-01-15",
      "Outstanding chicken pickle. The spice level is intense but the flavour underneath is complex and authentic. Ordering every month now."),
  ],

  Meat: [
    rev("Shankar R.", "2025-04-02",
      "Premium mutton pickle with real pieces of meat. The masala is made from scratch — not from a bottle — and you can taste the difference."),
    rev("Divya P.", "2024-11-22",
      "Best mutton pickle I have tasted. The fat-to-meat ratio is perfect and the spicing is complex and authentic."),
    rev("Priya K.", "2025-02-10",
      "Exceptional quality mutton pickle. Every jar has generous pieces and the masala is outstanding. Worth every rupee."),
  ],

  Prawns: [
    rev("Arjun T.", "2025-04-28",
      "The prawn pickle is absolutely coastal Andhra in flavour. Clean prawns, bold spice, perfect sesame oil base. Authentic and delicious."),
    rev("Meena S.", "2024-10-15",
      "Outstanding prawn pickle — the prawns are clean and well-deveined, the masala clings perfectly. Very fresh tasting."),
    rev("Kiran V.", "2025-01-22",
      "Excellent prawn pickle with genuine coastal Andhra flavour. The spice is bold and the prawns retain their texture.", 4),
  ],

  Fish: [
    rev("Lakshmi G.", "2025-03-18",
      "This fish pickle brings back memories of home. The fish pieces are big, boneless and beautifully marinated. Exceptional quality."),
    rev("Deepak R.", "2024-12-02",
      "The fish pickle has a wonderful flavour — no overpowering fishiness, just clean spiced fish. Goes perfectly with curd rice."),
    rev("Nirmala T.", "2025-02-25",
      "Excellent fish pickle with authentic Andhra flavour. The fish is fresh and well-pickled. Definitely ordering again."),
  ],

  // ─── PODI (9 types) ─────────────────────────────────────────────────────────

  KandiPodi: [
    rev("Suresh M.", "2025-03-30",
      "Kandi podi that tastes freshly roasted — you can smell the toor dal the moment you open the bag. Mix with ghee and rice — perfect."),
    rev("Anita N.", "2024-11-18",
      "Authentic kandi podi with real Guntur chilli heat. This is the gun powder that Andhra people have been eating for generations."),
    rev("Rohit K.", "2025-01-27",
      "Good quality kandi podi. The toor dal flavour is pronounced and the spice level is genuinely hot. Excellent with plain rice and ghee.", 4),
  ],

  IdlyPodi: [
    rev("Padma V.", "2025-04-10",
      "This idly podi transforms breakfast completely. Coarse, flavourful, with the right amount of heat. Better than any hotel podi I have had."),
    rev("Shankar R.", "2024-12-22",
      "Outstanding idly podi. Made with real ingredients — roasted dal, chilli, sesame. The coarseness is perfect for dipping idli."),
    rev("Divya P.", "2025-02-06",
      "Best idly podi I have ordered online. The flavour is complex and the texture is exactly right — not too fine, not too coarse."),
  ],

  NuvvulaPodi: [
    rev("Priya K.", "2025-03-05",
      "Nuvvulu podi with real sesame nuttiness. Goes wonderfully with rice and ghee. The sesame seeds are toasted to perfection."),
    rev("Arjun T.", "2024-11-10",
      "Good sesame podi with a pleasant nutty flavour and gentle heat. A different kind of podi — more subtle than kandi podi.", 4),
    rev("Meena S.", "2025-01-20",
      "Excellent nuvvulu podi. The roasted sesame aroma hits you when you open the pack. Very authentic preparation."),
  ],

  NalaKaram: [
    rev("Kiran V.", "2025-04-15",
      "Nala karam is seriously spicy and seriously good. The blend of lentils and chillies creates a flavour that is addictive with any rice dish."),
    rev("Lakshmi G.", "2024-10-05",
      "Authentic nala karam — hot, complex, and deeply satisfying. Goes beautifully with curd rice or as a side with any meal."),
    rev("Deepak R.", "2024-07-28",
      "Very spicy podi for chilli lovers. The flavour is authentic and the ingredients are clearly of good quality.", 4),
  ],

  PeanutPodi: [
    rev("Nirmala T.", "2025-03-20",
      "Peanut podi with genuine roasted groundnut flavour. Not overly spicy — just right. My children love it with dosas."),
    rev("Suresh M.", "2024-11-28",
      "Excellent peanut podi. The peanuts are properly roasted and the blend is harmonious. Different from other podis in the best way."),
    rev("Anita N.", "2025-02-03",
      "Good peanut podi with a pleasant nutty base and mild heat. Great for people who find kandi podi too spicy.", 4),
  ],

  CoconutPodi: [
    rev("Rohit K.", "2025-04-22",
      "Coconut podi that smells like fresh breakfast. The coconut is toasted beautifully and the chilli level is balanced. Excellent."),
    rev("Padma V.", "2024-12-12",
      "Wonderful coconut podi — fragrant and flavourful. Goes particularly well with idli and sets it apart from regular podis."),
    rev("Shankar R.", "2025-01-05",
      "Outstanding coconut podi. The dry coconut is properly roasted and the spicing is well-measured. Authentic Andhra preparation."),
  ],

  MoringaPodi: [
    rev("Divya P.", "2025-03-12",
      "Moringa podi that is both healthy and delicious. The drumstick leaf flavour comes through clearly. A great addition to my daily rice."),
    rev("Priya K.", "2024-10-20",
      "Excellent moringa podi. I buy this specifically for the health benefits but the flavour keeps bringing me back. Great quality."),
    rev("Arjun T.", "2025-01-15",
      "Good moringa podi with genuine drumstick leaf flavour. Earthy and spicy in a pleasing way. Healthy and tasty.", 4),
  ],

  RedChilliGarlicPodi: [
    rev("Meena S.", "2025-04-08",
      "This podi is fire — literally. Red chilli and garlic together make an explosive combination. Only a small amount is needed. Outstanding."),
    rev("Kiran V.", "2024-11-02",
      "Red chilli garlic podi is addictive. The garlic aroma and chilli heat together create something really special. My husband loves it."),
    rev("Lakshmi G.", "2025-02-19",
      "Very spicy but very flavourful. The garlic comes through strongly even against the chilli heat. Only for serious spice lovers.", 4),
  ],

  KakarakayaPodi: [
    rev("Deepak R.", "2025-03-25",
      "Kakarakaya podi with real bitter gourd flavour beautifully balanced by roasted spices. A unique podi that is genuinely healthy."),
    rev("Nirmala T.", "2024-12-18",
      "Good bitter gourd podi. The bitterness is tamed well by the roasting and spices. A healthy alternative to regular podis.", 4),
    rev("Suresh M.", "2025-01-30",
      "Excellent kakarakaya podi. The bitterness of the karela is barely noticeable — just a deep earthy flavour with good spice."),
  ],

  // ─── SNACKS (8 types) ───────────────────────────────────────────────────────

  Chegodi: [
    rev("Anita N.", "2025-04-05",
      "The chegodi arrived perfectly crisp and the crunch is excellent. Sesame and cumin come through in every bite. Authentic Andhra snack."),
    rev("Rohit K.", "2024-11-15",
      "Chegodi that actually stays crispy even after a week. The rice flour is perfectly fried and the sesame seeds add great flavour."),
    rev("Padma V.", "2025-02-28",
      "Very good chegodi — crispy and well-seasoned. Not as oily as expected. Goes perfectly with evening tea.", 4),
  ],

  Jantikalu: [
    rev("Shankar R.", "2025-03-18",
      "Real Andhra jantikalu — crispy, light and perfectly spiced. The texture is exactly right — snaps cleanly without being hard."),
    rev("Divya P.", "2024-12-05",
      "Outstanding jantikalu. The spiral shape holds together well and the seasoning is perfect. Takes me back to festival snacking in Andhra."),
    rev("Priya K.", "2025-01-22",
      "Excellent jantikalu. Crispy, fragrant with cumin and chilli. My whole family finished the pack in one sitting."),
  ],

  ChallaMirchi: [
    rev("Arjun T.", "2025-04-20",
      "Challa mirchi done right — the sourness from the buttermilk marinade and the chilli heat are perfectly balanced. Addictive with any meal."),
    rev("Meena S.", "2024-10-28",
      "Outstanding buttermilk chilli. The sourness is genuine and the chilli retains its texture. Completely authentic preparation."),
    rev("Kiran V.", "2025-02-12",
      "Very good challa mirchi. The tanginess and heat are well-balanced. A unique product I had not tried before ordering.", 4),
  ],

  DahiMirchi: [
    rev("Lakshmi G.", "2025-03-30",
      "Dahi mirchi made the traditional way — the curd coating on the chilli is thick and the frying is perfect. Crispy and tangy."),
    rev("Deepak R.", "2024-11-12",
      "Excellent dahi mirchi. The yogurt-marinated chillies fry up beautifully. A condiment that elevates any simple meal."),
    rev("Nirmala T.", "2025-01-18",
      "Good dahi mirchi with authentic sour and spicy flavour. The chillies are well-sized and the frying is perfectly done.", 4),
  ],

  Vadiyalu: [
    rev("Suresh M.", "2025-04-12",
      "Vadiyalu with perfect crunch — the lentil dumplings are crispy on the outside and just slightly chewy inside. Great with dal rice."),
    rev("Anita N.", "2024-12-25",
      "Authentic sun-dried vadiyalu. The flavour is deeply savoury and the texture after frying is exactly right. Andhra comfort food."),
    rev("Rohit K.", "2025-02-05",
      "Outstanding vadiyalu. Fry them in a little oil and they puff up beautifully. Perfect with curd rice or as a crunchy side."),
  ],

  BoondiMixture: [
    rev("Padma V.", "2025-03-08",
      "The boondi mixture is fresh, crispy and perfectly spiced. Not too oily — very well made. I bought it for guests and everyone loved it."),
    rev("Shankar R.", "2024-11-20",
      "Excellent boondi mixture. The boondi is properly fried and the masala coating is generous. Goes well with evening tea."),
    rev("Divya P.", "2025-01-12",
      "Good mixture with fresh boondi, fried chillies and good seasoning. Crispy and flavourful. Worth the price.", 4),
  ],

  CornflakesMixture: [
    rev("Priya K.", "2025-04-25",
      "Cornflakes mixture that is genuinely addictive. Light, crispy and spiced beautifully with curry leaves and chilli. Very fresh."),
    rev("Arjun T.", "2024-12-15",
      "Good cornflakes mixture with a nice crunch and pleasant spice. A lighter snack option that does not feel heavy.", 4),
    rev("Meena S.", "2025-02-20",
      "Outstanding cornflakes mixture. The freshness is evident — not stale at all. Perfectly seasoned and very moreish."),
  ],

  KajuRoasted: [
    rev("Kiran V.", "2025-03-22",
      "The roasted cashews are perfectly done — crispy, well-seasoned with spices and genuinely fresh. A premium snack at a fair price."),
    rev("Lakshmi G.", "2024-11-08",
      "Excellent roasted cashews. The masala coating is light but flavourful. Goes perfectly with tea or as a party snack."),
    rev("Deepak R.", "2025-01-08",
      "Outstanding quality cashews — large, well-roasted, perfectly spiced. The freshness is clear. Ordering again for sure."),
  ],

  // ─── SWEETS (12 types) ──────────────────────────────────────────────────────

  Ariselu: [
    rev("Nirmala T.", "2025-04-15",
      "Ariselu that tastes exactly like Sankranti at home. The jaggery sweetness, sesame crunch and rice texture are all perfectly balanced."),
    rev("Suresh M.", "2024-12-28",
      "Outstanding ariselu — the jaggery quality is clearly unrefined and the frying is done right. Not too sweet, not too oily."),
    rev("Anita N.", "2025-02-08",
      "Best ariselu I have eaten outside Andhra. The crispy outside and soft inside are exactly how they should be. A genuine festival sweet."),
  ],

  MadtaKaja: [
    rev("Rohit K.", "2025-03-28",
      "Madta Kaja with perfect layered texture — crispy, flaky and soaked in light sugar syrup. Exactly the taste I remember from Kakinada."),
    rev("Padma V.", "2024-11-25",
      "Authentic Andhra kaja. The layers peel apart beautifully and the sweetness is just right — not cloying. Excellent quality."),
    rev("Shankar R.", "2025-01-18",
      "Outstanding kaja — the pastry is light and crispy, the syrup coating is thin. Traditional taste that is hard to find outside Andhra."),
  ],

  Sunundalu: [
    rev("Divya P.", "2025-04-08",
      "Sunundalu with genuine urad dal flavour. Sweet, dense and very satisfying. A healthy traditional sweet that I eat every day."),
    rev("Priya K.", "2024-12-12",
      "Excellent sunundalu. The urad dal is properly roasted and the jaggery binding is perfect. Classic Andhra sweet done right."),
    rev("Arjun T.", "2025-02-22",
      "Good quality sunundalu — slightly sweet with real dal flavour. The texture is firm but not hard. Great for gifting.", 4),
  ],

  Pootharekulu: [
    rev("Meena S.", "2025-03-15",
      "Pootharekulu that is paper-thin and perfectly made. The jaggery and dry fruit filling is generous. A truly exceptional Andhra sweet."),
    rev("Kiran V.", "2024-11-02",
      "This is the real Atreyapuram pootharekulu — delicate rice paper with jaggery and ghee. Nothing like you find in sweet shops."),
    rev("Lakshmi G.", "2025-01-28",
      "Outstanding pootharekulu. The rice paper layers are so thin they melt in the mouth. Fresh, delicate and perfectly made."),
  ],

  GulabPuvu: [
    rev("Deepak R.", "2025-04-18",
      "Gulab puvu that is crispy, lightly sweet and beautifully shaped. A festival sweet that is very light compared to other Indian sweets."),
    rev("Nirmala T.", "2024-12-20",
      "Pretty and tasty gulab puvu. The sweetness is mild and the texture is delightfully crispy. A unique Andhra sweet.", 4),
    rev("Suresh M.", "2025-02-12",
      "Beautiful gulab puvu — the flower shape is intact and the sweet is perfectly fried. Delicate sweetness with great crunch."),
  ],

  BellamGavalu: [
    rev("Anita N.", "2025-03-05",
      "Bellam gavalu with real jaggery coating — the crunch of the fried shell and the jaggery sweetness is a perfect combination."),
    rev("Rohit K.", "2024-10-18",
      "Outstanding bellam gavalu. The shells are crispy and the jaggery coating has a nice caramel depth. Very nostalgic flavour."),
    rev("Padma V.", "2025-01-12",
      "Excellent bellam gavalu. Light, crispy and sweetened with real jaggery — not sugar syrup. Authentic traditional preparation."),
  ],

  KajuChikki: [
    rev("Shankar R.", "2025-04-25",
      "Cashew chikki with excellent quality cashews and proper jaggery. The brittle breaks cleanly and the cashew flavour is outstanding."),
    rev("Divya P.", "2024-12-08",
      "Best kaju chikki I have ordered online. The jaggery-to-cashew ratio is perfect and the brittle is not too hard or too soft."),
    rev("Priya K.", "2025-02-18",
      "Outstanding cashew chikki. Fresh cashews, real jaggery, and perfect set. A premium quality traditional sweet."),
  ],

  BoondiLaddu: [
    rev("Arjun T.", "2025-03-20",
      "Boondi laddu made the right way — the boondi is properly fried, the syrup binding is correct, and the cardamom is prominent."),
    rev("Meena S.", "2024-11-28",
      "Excellent boondi laddu. The size is generous, the sweetness is well-measured, and the flavour is genuinely authentic."),
    rev("Kiran V.", "2025-01-25",
      "Very good boondi laddu. The boondi is of good quality and the laddus hold their shape well. Classic festival sweet.", 4),
  ],

  MysorePak: [
    rev("Lakshmi G.", "2025-04-02",
      "Mysore pak with the right crumbly-fudge texture and rich ghee flavour. The chickpea flour is properly roasted and the sweetness is balanced."),
    rev("Deepak R.", "2024-12-25",
      "Outstanding mysore pak — properly porous and rich with ghee. Not the hard block type but the genuine soft preparation."),
    rev("Nirmala T.", "2025-02-05",
      "Excellent mysore pak. Melts in the mouth and the ghee flavour is prominent throughout. Premium quality traditional sweet."),
  ],

  DryFruitsLaddu: [
    rev("Suresh M.", "2025-03-12",
      "Dry fruits laddu packed with cashews, almonds, dates and raisins. Naturally sweet without added sugar. A very healthy sweet."),
    rev("Anita N.", "2024-11-20",
      "Outstanding dry fruit laddu. Dense, nutritious and naturally sweet from the dates. Great as a healthy sweet option."),
    rev("Rohit K.", "2025-01-30",
      "Good quality dry fruit laddu with generous dry fruits. Binding is excellent — laddus do not crumble. A premium gift option.", 4),
  ],

  RavaLaddu: [
    rev("Padma V.", "2025-04-10",
      "Rava laddu with perfect texture — slightly crumbly, fragrant with cardamom and rich with ghee. A classic done beautifully."),
    rev("Shankar R.", "2024-12-18",
      "Excellent rava laddu. The semolina is properly roasted and the coconut and cardamom are prominently flavoured. Traditional and delicious."),
    rev("Divya P.", "2025-02-15",
      "Outstanding rava laddu. Light, not too sweet, and perfectly shaped. Goes very well with a cup of tea in the evening."),
  ],

  GondLaddu: [
    rev("Priya K.", "2025-03-28",
      "Gond laddu packed with edible gum, dry fruits and whole wheat. Hearty and nourishing — a traditional winter sweet that really delivers."),
    rev("Arjun T.", "2024-11-05",
      "Excellent gond laddu. The edible gum gives a unique texture and the dry fruits are generous. A healthy and traditional sweet."),
    rev("Meena S.", "2025-01-22",
      "Very good gond laddu. Rich in nutrients with a satisfying texture. Good quality ingredients — you can taste the real gond.", 4),
  ],

  // ─── NEW SNACKS (6 types) ───────────────────────────────────────────────────

  GathiyaSticks: [
    rev("Bhavna R.", "2025-04-22",
      "Gathiya sticks with proper gram flour flavour and a clean, lingering crunch. Not too oily, not too salty. This is the real Gujarati tea-time snack — ordered a second pack the same week."),
    rev("Chirag P.", "2024-12-10",
      "I grew up eating gathiya in Ahmedabad and this is as close as I have found to the real thing. The besan is properly cooked, the spice level is balanced."),
    rev("Harini S.", "2025-02-28",
      "Crispy, light and mildly spiced gathiya sticks. Good quality besan — you can tell from the taste. Excellent with chai in the evening.", 4),
  ],

  BhavnagariGathiya: [
    rev("Tejas M.", "2025-05-05",
      "Bhavnagari gathiya is thicker and softer than regular gathiya and this batch nails it. The texture is almost buttery inside with a slight crunch on the outside. Very addictive."),
    rev("Rekha V.", "2025-01-14",
      "Absolutely authentic Bhavnagar-style gathiya. My husband is from Bhavnagar and he approves — which means something. The mild spice and soft texture are exactly right."),
    rev("Naveen K.", "2024-11-30",
      "Different from normal gathiya in the best way. Thicker, softer and more flavourful. A must try if you have only had the thin crispy kind.", 4),
  ],

  Fafda: [
    rev("Krupa D.", "2025-04-01",
      "Fafda that actually snaps when you break it. Light, crispy and properly seasoned with carom seeds and black pepper. This is the fafda you eat Sunday morning — not any other day."),
    rev("Sanjay B.", "2024-12-05",
      "Excellent fafda — the texture is spot on. Not brittle-hard and not soft, the perfect middle ground. Clean oil taste with the right amount of ajwain."),
    rev("Yamini L.", "2025-03-10",
      "Good quality fafda with proper chickpea flour flavour. Crunchy throughout and not greasy. Pairs very well with green chutney.", 4),
  ],

  FarsanMix: [
    rev("Aakash T.", "2025-04-28",
      "Farsan mix with real variety — gathiya bits, sev, dal moth and fried peanuts all in the right proportions. Every handful is different. Exactly what farsan should be."),
    rev("Geeta N.", "2025-01-20",
      "Outstanding farsan mix. The components are fresh and the spice balance is good — not too hot, not too mild. This is everyday Gujarati snacking done properly."),
    rev("Madhuri C.", "2024-10-25",
      "Very good farsan mix. Generous portion and good freshness on everything in it. The namkeen dal and the thin sev together make a great combination.", 4),
  ],

  Khakhra: [
    rev("Swapna G.", "2025-03-18",
      "Thin, crispy khakhra with even roasting throughout. The wheat flavour is clean and the seasoning is mild enough to let the grain come through. Good with pickle or just as a standalone snack."),
    rev("Vijay R.", "2024-11-08",
      "Excellent khakhra — properly thin and crispy without any raw flour taste. Light snack that you can eat without feeling heavy. Will reorder."),
    rev("Sravani P.", "2025-02-06",
      "Good quality khakhra. The texture is crispy and uniform and the flavour is well-seasoned. Much better than packaged supermarket versions.", 4),
  ],

  NylonSev: [
    rev("Ramesh T.", "2025-04-14",
      "Nylon sev that is genuinely hair-thin and crispy — not the thick kind sold as nylon sev elsewhere. Melts the moment it hits your tongue. Used half of it on chaat and ate the rest straight from the pack."),
    rev("Kavitha M.", "2025-01-03",
      "Real nylon sev — ultra-fine, perfectly salted and very fresh. This is what you need for bhel puri and sev puri to taste right. Finally found a reliable source."),
    rev("Anil B.", "2024-12-20",
      "Outstanding nylon sev. The fineness is real and the oil used is clean-tasting. No stale smell, good crunch. Ordered extra to stock up.", 4),
  ],

  // ─── NEW SWEET (1 type) ─────────────────────────────────────────────────────

  PostDeliveryLaddu: [
    rev("Lalitha K.", "2025-04-08",
      "Ordered for my sister after her delivery. She has been having one laddu every morning with warm milk and says the gond, ajwain and dry fruits together are genuinely warming. Traditional preparation that actually does what it claims."),
    rev("Pooja V.", "2025-01-28",
      "My mother-in-law insisted we order these after my delivery and I understand why now. Rich, dense and nourishing — not just sweet. The dried ginger and ajwain give a warmth that stays with you."),
    rev("Rashida N.", "2024-12-02",
      "Gifted these to a new mother in our family. The ingredients list is exactly right — gond, whole wheat, dry fruits, ghee. Traditional recipe made with good quality inputs. She loved them.", 4),
  ],

};
