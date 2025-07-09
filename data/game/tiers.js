/* ─────────────────────────────────────────────────────────────
   DYNAMIC PLACE-HOLDERS (replace at render time)
   <bedroom>         e.g. "2-bedroom"
   <house_type>      e.g. "terrace", "detached"  (lower-case!)
   <location_zone>   "Island" | "Mainland" | "Outskirt"
   <years_num>       number   (rounded up)
   <timeline_phrase> e.g. "in under two years", "in about five years"
   ───────────────────────────────────────────────────────────── */

export const TIERS = [
  /* ─────────────────── 1. CERTIFIED BALLER ─────────────────── */
  {
    maxYears: 3,
    emoji: '1.png',
    label: 'You are a Certified Baller',

    descriptions: [
      /* 0 */ 'Your new house is ready like tomorrow is too late. You belong to the Landlord Gang!',
      /* 1 */ 'Your wallet dey kampe. You can buy your house from the market.',
      /* 2 */ 'Your bank app is green like traffic light; Odogwu, speed up to your new gate!',
      /* 3 */ 'Your account balance is flexing harder than bouncer; house keys lining up for autograph.',
      /* 4 */ 'Your wallet can buy plenty jollof rice to celebrate your new home with zero wahala.',
      /* 5 */ 'Your bank account na confam. Time to spend the money on your new home',
      /* 6 */ 'Your bank account get muscle; you fit carry a whole estate with one hand.',
      /* 7 */ 'Na property dey rush you; just open your gate and collect your key.',
      /* 8 */ 'Your account balance shines brighter than the sun. With your account balance, every house dey salute you.',
      /* 9 */ 'Your bank alert dey play beautiful music; plenty houses don dey dance azonto for you!',
    ],

    summaries: {
      rent: [
        /* 0 */ 'Rent goat don chop tire—time to buy the whole farm. Your shiny <bedroom> <house_type> on the <location_zone> is waving like a flag. Keep your hustle hot and the keys drop <timeline_phrase>. Imagine decorating your room in <location_zone> while your landlord wonders where you vanished.',
        /* 1 */ "Last lap, chief! Savings sprinting faster than okada on free road. One tiny push and you'll be frying plantain in your own kitchen before <years_num> birthdays pass. The deed will carry your name, not your landlord's. Jollof tastes sweeter when the pot is in your house.",
        /* 2 */ 'Those rent receipts are taller than you—swap them for a land deed. Lock a <house_type> fast and let the future you send high-five emojis. Keys can land in <timeline_phrase> if you keep stacking coins. Landlord selfie incoming!',
        /* 3 */ 'Your landlord dey price Benz with your transfers; flip the script. Grab a <bedroom> <house_type>, and soon tenants will fund *your* ride. Stay steady and be consistent with your hardwork. Goodbye rent, hello road trip!',
        /* 4 */ "No more “God when”, it's “Thank you God”. Keys loading like cartoon power-up. Jollof pot already warming in <location_zone>. Pack your things and practise the happy dance.",
        /* 5 */ 'Your new <bedroom> <house_type> in <location_zone> is gift-wrapped by destiny. One final savings shout and the courier—aka your agent—rings the bell. Birthday song next year will echo inside your own walls. Sweet, right?',
        /* 6 */ 'Renting? Not for long! The <house_type> in <location_zone> keeps showing in your dreams. Feed that deposit, watch keys hatch, and shout “Home sweet home!” four times for luck.',
        /* 7 */ 'Goodbye rent, hello giggles! Your <bedroom> <house_type> on the <location_zone> calls your name like suya smoke. Sign, smile, and invite friends for game night. The fun starts the day you hang curtains.',
        /* 8 */ 'Suitcases ready. Your cool <house_type> with <bedroom> sits a hug away. Dodge three more rent invoices and the door remote is yours. Practise victory dance in the mirror!',
        /* 9 */ "Rent farewell tour loading. Soon you'll host a welcome-home party in your <bedroom> <house_type> on the <location_zone>. Keep stacking and keep grinning. The guest list already buzzing.",
      ],

      own: [
        /* 0 */ 'One roof, two roofs—who dey count? Add a <bedroom> <house_type> on the <location_zone> and let rent alerts sing morning anthem. Equity is your super-power; strike <timeline_phrase>. More houses, more high-fives, more chilled zobo.',
        /* 1 */ 'Equity just learned kung-fu. Slice a piece, drop deposit, and welcome a new property to Team <first_name>. Tenants will soon pay your light bills. House number two loves company!',
        /* 2 */ "People brag about plots; you collect postcodes. Keep saving and in <years_num> short years you'll own half the street. Street-owner swag unlocked. Time to design your own street sign!",
        /* 3 */ "Portfolio Flex 101: roll today's cashflow into new walls. Tenants will sponsor your next beach trip while you sleep. That's money doing jumping jacks for you. Legendary move!",
        /* 4 */ 'Math is simple—stack naira, drop down-payment, smile. Grab that <house_type> now and bank manager will call you “Oga Landlord.” Easy cruise, zero potholes, plenty bragging rights.',
        /* 5 */ 'House already? Big win! But a sparkling <bedroom> <house_type> in <location_zone> is winking. Sign fast, cue the confetti. Double doors, double pride!',
        /* 6 */ 'Boss landlord! Copy-paste the magic: bag a new <house_type> with <bedroom> on the <location_zone>. Your rent alerts will form a choir. Symphony of cash, baby!',
        /* 7 */ 'Another comfy <bedroom> <house_type> waits a handshake away. Keep the moving truck fuelled. Expansion is your hobby now. Collect keys, collect smiles.',
        /* 8 */ 'Landlord life is light work for you. A fresh <house_type> in <location_zone> will be ready <timeline_phrase>. Family photos, new memories, bigger flex!',
        /* 9 */ 'Champion mode activated. Add one more <bedroom> <house_type> on the <location_zone> and celebrate with ice-cream plus sprinkles. Rent cheques taste like extra toppings. Yum!',
      ],

      family: [
        /* 0 */ 'Free jollof sweet, but your own kitchen aroma is sweeter. A <bedroom> <house_type> on the <location_zone> hides just beyond the gate. Keep saving and meal times become home times <timeline_phrase>. Your first pot of stew will smell like victory.',
        /* 1 */ 'Goodbye “Who ate my meat?” mystery. Midnight snacks await in a home with your name on the door. Keys could jingle <timeline_phrase> if you keep the savings heat high. Freedom tastes like toasted bread at 2 a.m.',
        /* 2 */ "Mum's Wi-Fi ends at the corridor; your router will have no borders. Stay on track and your “temporary stay” will end very soon. Streaming cartoons in pyjamas—zero permission needed. Fun unlocked!",
        /* 3 */ 'Family house became HQ; now open a branch office called *Your House*. Keep deposits steady and ribbon-cutting day arrives <timeline_phrase>. Invite the crew and blast party horns!',
        /* 4 */ "Curfew only in generator timetable. Keys charging—don't unplug the hustle. Three smiles a day keeps doubt away. Own it, live it, love it.",
        /* 5 */ 'Living with fam is cool, but owning a <house_type> with <bedroom> in <location_zone> is cooler than chilled Fanta. A few more deposits and game-room dreams come true. Paint the walls any colour you want!',
        /* 6 */ 'Family hangout is sweet, but imagine your own <bedroom> <house_type> on the <location_zone>. Design your poster bed, choose wall stickers, blast your playlist. All that freedom sits just around the corner.',
        /* 7 */ 'Home is cozy, but your very own <house_type> with <bedroom> is super-duper close. Video games at 2 a.m.—no “Lights out!” alarms. Keep stacking, keep smiling, keep dreaming big.',
        /* 8 */ 'New adventure loading: a fun <bedroom> <house_type> in <location_zone>. Sketch your dream room, tape it to your mirror, and watch it come alive. Your hustle is the colouring pencil.',
        /* 9 */ "Get set! Soon you'll move from family couch to an awesome <house_type> with <bedroom> on the <location_zone>. Pack imagination first, luggage second. Coolest adventure ever starts <timeline_phrase>!",
      ],
    },
  },
  /* ─────────────────── 2. ALMOST THERE ────────────────────── */
  {
    maxYears: 6,
    emoji: '2.png',
    label: 'You are Almost There',
    /* descriptions[ i ] ↔ summaries.*[ i ] */
    descriptions: [
      /* 0 */ 'Your ice-cream truck of homeownership is close. Just one more street to cross.',
      /* 1 */ 'Your savings balloon is big; One tiny breath and it pops into keys.',
      /* 2 */ 'Your house keys waving above you with pride. Raise your hand and grab them.',
      /* 3 */ 'Only a little hustle left, the gate of your new home will swing open just for you.',
      /* 4 */ 'Only a small spark left; when it lights, your new home will glow with different light.',
      /* 5 */ 'Your puff-puff is already rising, keep the heat and it will turn into a new home.',
      /* 6 */ 'Your money marathon is on the last lap; Just a little run and you will win the medal.',
      /* 7 */ 'Your doorbell is gently calling your name, walk faster and press it yourself.',
      /* 8 */ 'Your savings soup is thick; one more stir and it will serve in your new kitchen.',
      /* 9 */ 'Just a tiny push and you will see your new house keys hiding behind the corner.',
    ],

    summaries: {
      /* ————————— RENTING ————————— */
      rent: [
        /* 0 */ "Ice-cream makes kids smile, and so will your new <bedroom> <house_type> on the <location_zone>. The truck is already on your street. Keep adding coins to the jar and the driver stops <timeline_phrase>. Soon you'll lick ice-cream in your own living room.",
        /* 1 */ 'Your balloon of savings is floating high. One more breath of hustle and it bursts into shiny house keys. A sweet <bedroom> <house_type> in <location_zone> is ready to land. Hold tight—party hats soon!',
        /* 2 */ 'The keys keep waving like teacher in class. Answer “Present!” by paying rent to yourself instead of the landlord. <timeline_phrase>, those keys will jingle in your pocket. Roll out a carpet and invite friends.',
        /* 3 */ 'Only a small hill of hustle remains. Climb it and the gate of a cozy <house_type> with <bedroom> swings wide. Pack slippers, pack smiles, and move in before <years_num> rent renewals pass. Goodbye yearly headaches!',
        /* 4 */ 'A spark can start a camp-fire; your extra savings spark starts a home. Fan it gently and a warm <bedroom> <house_type> on the <location_zone> appears. Marshmallows taste better when roasted in your yard. Keep fanning!',
        /* 5 */ 'Your puff-puff pocket smells delicious. Fry a few more notes and it changes into a doorstep. The <house_type> with <bedroom> you love in <location_zone> is nearly served. Ring the bell and shout “Snack time!”',
        /* 6 */ 'Marathon almost done. Dash the last meters and break the ribbon at your <bedroom> <house_type>. Neighbours will cheer, rent will disappear. Trophy = house keys, and they sparkle!',
        /* 7 */ 'Can you hear the doorbell? It is whispering your name. Keep saving and soon you will press it yourself. Welcome mats feel soft under boss feet.',
        /* 8 */ 'Savings soup thick enough to stand a spoon. Add one more scoop and dinner moves to your own kitchen. A warm <bedroom> <house_type> on the <location_zone> waits with pepper stew smells. Yum and done!',
        /* 9 */ 'Give the dream a tiny push and the boom will echo money. Keys jump out and shout surprise. Your <bedroom> <house_type> in <location_zone> becomes real. Get balloons, cake, and new address stickers.',
      ],

      /* ————————— ALREADY OWNS ————————— */
      own: [
        /* 0 */ 'One street crossed, another castle gained. Add a sweet <bedroom> <house_type> on the <location_zone> and let rent alerts play like ice-cream jingles. Equity wheels are rolling fast. Scoop the deal <timeline_phrase>!',
        /* 1 */ 'Savings balloon ready to pop? Burst it into a second home! Slide deposit to a fresh <house_type> with <bedroom> in <location_zone>. Double keys, double smiles, double jollof.',
        /* 2 */ 'Keys waving means portfolio growing. Answer the roll call by grabbing a new <bedroom> <house_type>. More rents flow in, more high-fives fly out. Simple maths: You win.',
        /* 3 */ 'Small hill of hustle, big mountain of reward. Climb and plant your flag on another property peak. Tenants will clap while you relax. Peak life indeed.',
        /* 4 */ 'One spark of equity lights another lamp. Soon a shiny <house_type> with <bedroom> glows beside the first. Street looks brighter and so does your wallet. Let it shine!',
        /* 5 */ 'Pocket puff-puff equals capital. Flip it into keys for a house in <location_zone>. Rent cheques will smell sweeter than doughnuts. Sprinkle sugar of patience and enjoy.',
        /* 6 */ 'Finish the money marathon like a champ. Cross the line and grab house number two. Cheering crowd? Your bank app flashing rent alerts. Gold medal secured.',
        /* 7 */ "Doorbell chanting your name? That's equity calling for action. Sign papers, collect keys, and add new address to your empire list. Ding-dong, you're richer.",
        /* 8 */ 'Soup of savings thick? Pour it into bricks. A warm <bedroom> <house_type> on the <location_zone> joins dinner. More plates, more income, more fun. Bon appétit, landlord!',
        /* 9 */ 'Push softly, earn loudly. Another home pops onto your map. Ice-cream celebrations plus rent flows equal extra smiles. Keep collecting!',
      ],

      /* ————————— FAMILY / FRIENDS ————————— */
      family: [
        /* 0 */ "Ice-cream is great, but privacy is sweeter. A <bedroom> <house_type> on the <location_zone> waits after one last saving sprint. Soon you'll scoop ice-cream at midnight with no “Who left the light on?”",
        /* 1 */ 'Balloon of freedom almost lifts you off the couch. Pop it into keys and float into your first home. Everyone will clap, including the couch you leave behind. Fly, <first_name>, fly!',
        /* 2 */ "Teacher keys wave—time to answer. Shout “Present!” by packing boxes. In <timeline_phrase> you'll stream cartoons at full volume. No parental “Turn it down!” notices.",
        /* 3 */ 'Tiny hustle left; door swings open to your own place. The welcome mat will finally be yours. Family will visit, but you choose bedtime. Nice, right?',
        /* 4 */ 'Spark your dream, light your house fire. Cook jollof anytime without permission. Your <house_type> with <bedroom> is almost ready. Tummy and freedom both happy.',
        /* 5 */ 'Pocket puff-puff smells yummy; turn it into rent-free living. A fun <bedroom> <house_type> in <location_zone> is baking. Ice the cake with a big “Welcome Home” sign.',
        /* 6 */ "Marathon nearly done—leave the parents' track and sprint into your own lane. Keys act as medal. Crowd (aka friends) will cheer during house-warming.",
        /* 7 */ "Doorbell calling your name? That is the sound of privacy. Keep at it and you'll press it soon. Game nights go on till rooster crows.",
        /* 8 */ 'Savings soup bubbling; pour it into bricks and paint. Your <bedroom> <house_type> on the <location_zone> will smell like fresh stew and new paint. Slurp success.',
        /* 9 */ 'Tiny push, big boom—keys ready to jump into your palm. Goodbye shared remote fights; hello personal sofa kingdom. Adventure begins <timeline_phrase>. Pack joy first!',
      ],
    },
  },

  /* ─────────────────── 3. GETTING STARTED (index-aligned) ─────────────────── */
  {
    maxYears: 10,
    emoji: '3.png',
    label: 'You are Getting Started',
    /* descriptions[ i ] ↔ summaries.*[ i ]  (10 each) */
    descriptions: [
      /* 0 */ 'Start taking baby steps today, it will turn into a giant footprint tomorrow.',
      /* 1 */ 'Your savings is like keke in a Lagos traffic, no worry, you go reach your new house one day.',
      /* 2 */ 'Your little drop of pure water, can fill the mighty ocean of your new house.',
      /* 3 */ "Your big dream engine is currently on; Don't press brake.",
      /* 4 */ 'Your tiny bricks of today, will turn into tall buildings in the future.',
      /* 5 */ 'If you save more in your bank account, money go dey everywhere!',
      /* 6 */ 'Your wallet is learning how to crawl before it runs.',
      /* 7 */ 'Every naira is a seed, plant all of your naira towards your new home now.',
      /* 8 */ 'Your savings sprouts are peeping through the soil. Keep pushing.',
      /* 9 */ 'Your battery is currently charging; your new house percentage is increasing everyday.',
    ],

    summaries: {
      /* ————————— RENTING ————————— */
      rent: [
        /* 0 */ "Baby steps build brave legs. Drop another coin today and soon you step into a <bedroom> <house_type> on the <location_zone>. Keep stepping and you'll reach the gate <timeline_phrase>. The welcome mat is already rolling out for <first_name>.",
        /* 1 */ 'Your keke-savings still dey go slow, but e dey always move. Add a little fuel and stay seated for about <years_num> fun years. The ride stops beside a <bedroom> <house_type> in <location_zone>. Ring the bell and shout “I have arrived!”',
        /* 2 */ 'Pure-water drops look tiny, yet they fill a bucket of wealth. Squeeze a drop every day and the bucket turns into a <bedroom> <house_type> on the <location_zone>. Keep it up and keys pour into your hand <timeline_phrase>.',
        /* 3 */ "Your dream car is already in gear—don't press brake now. Rev a bit harder and a <bedroom> <house_type> in <location_zone> speeds toward you. Stay on the road and park <timeline_phrase>. Honk twice if you love land!",
        /* 4 */ 'One tiny brick each week soon builds a castle wall. Keep stacking until the castle becomes a <bedroom> <house_type> in <location_zone>. Knights and princesses optional, but keys are guaranteed. Your storybook ending is close.',
        /* 5 */ 'Your savings just went boom, money dey everywhere! Sweep them into a deposit for a <bedroom> <house_type> in <location_zone>. Keep adding and the pig will oink out keys <timeline_phrase>. Best explosion ever!',
        /* 6 */ "Your wallet is crawling now; soon it will run. Feed it allowance and watch it grow strong. When it's fit it will carry a <bedroom> <house_type> on the <location_zone>. Crawling days end <timeline_phrase>. Wallet will shout “We made it!”",
        /* 7 */ 'Every naira is a seed. Plant them and a money tree grows tall. Shake the tree and a <bedroom> <house_type> on the <location_zone> falls out. Harvest <timeline_phrase>. Free mangoes, free mortgage!',
        /* 8 */ 'Savings sprouts are saying hello from the soil. Water them with discipline and they turn into a <bedroom> <house_type> in <location_zone>. Harvest season arrives <timeline_phrase>. Pack a picnic for move-in day!',
        /* 9 */ 'Battery at 60% and climbing. Keep it plugged into your savings socket. When it hits 100 % you unlock a <bedroom> <house_type> on the <location_zone>. Countdown says <years_num> years to full charge. Get ready to press power!',
      ],

      /* ————————— ALREADY OWNS ————————— */
      own: [
        /* 0 */ 'Baby steps also win marathons. Use rent from house one to feed house two. A fresh <bedroom> <house_type> on the <location_zone> joins your team <timeline_phrase>. Small steps, big empire, huge smiles.',
        /* 1 */ "House one bought the keke; house two will be the bus. Funnel today's rent income into the bigger engine. In <timeline_phrase> you'll park a <bedroom> <house_type> in <location_zone>. Riders will call you Chairman Driver.",
        /* 2 */ 'Little drops still make big splashes. Redirect part of your rent income and a new <bedroom> <house_type> in <location_zone> pops into your portfolio before <years_num> birthdays. Tiny drops, mega splash. Odogwu moves!',
        /* 3 */ 'Dream bigger! One house is prologue, not the story. Shift gear with equity and chase property two. In <years_num> years a <bedroom> <house_type> on the <location_zone> headlines your success tale. Bestseller unlocked.',
        /* 4 */ 'Brick stacking is easier when rent cheques do the lifting. Redirect one cheque a quarter into a land wallet. By <timeline_phrase> your shiny <bedroom> <house_type> on the <location_zone> stands tall. Castle upgrade achieved!',
        /* 5 */ 'Savings fireworks can light up new profit rooms. Gather the glittering coins and fire them at a second property. A sparkling <bedroom> <house_type> on the <location_zone> answers back. Double boom, double income!',
        /* 6 */ 'Your first house taught your wallet to crawl; rent inflows teach it to jog. Push those coins toward a <bedroom> <house_type> in <location_zone>. Soon it sprints, bringing rent medals home. Champion wallet!',
        /* 7 */ 'Seeds from rent income sprout even faster. Replant them in fresh soil called land and a juicy <bedroom> <house_type> in <location_zone> blooms soon. Orchard of properties loading. Sweet harvest ahead!',
        /* 8 */ 'Equity sprouts green in your lawn already. Transplant some into new ground and watch a tall <bedroom> <house_type> on the <location_zone> grow beside the first. Garden of wealth getting greener. Keep watering!',
        /* 9 */ 'Your asset battery recharges with every rent alert. Another 40 % and you power up a brand-new <bedroom> <house_type> in <location_zone>. Keys are the start button. Press play soon and enjoy the sequel!',
      ],

      /* ————————— FAMILY / FRIENDS ————————— */
      family: [
        /* 0 */ 'Baby steps away from the family sofa begin with one tiny deposit. Each step is a cheer from your piggy-bank. Keep going and a <bedroom> <house_type> on the <location_zone> appears <timeline_phrase>. First dance in the living room will be epic.',
        /* 1 */ 'Keke trips beat bus-stop waits. Pay the fare into your savings jar and ride. Soon the keke parks at your own <bedroom> <house_type> on the <location_zone>. Freedom horn blasts—everybody wave!',
        /* 2 */ 'Pure-water savings beat pure-water excuses. Stack sachets of coins until they look like walls. Swap them for real walls in a <bedroom> <house_type> on the <location_zone>. Cool drink, cooler address, coolest you.',
        /* 3 */ 'Dreams love action, not just pillow talk. Swap bedtime stories for deposit stories. Each chapter moves a <bedroom> <house_type> on the <location_zone> closer. The happy ending? You shouting “Surprise, I moved!”',
        /* 4 */ 'Bricks make noise when they drop—let family hear yours. Drop small, drop often. Soon the pile resembles a <bedroom> <house_type> in <location_zone>. Then say, “Welcome to my kingdom!” and hand out popcorn.',
        /* 5 */ "Bang! Your savings don land. Scoop the treasure into a house jar. Target a cute <bedroom> <house_type> on the <location_zone>. Move day will feel like New Year's fireworks in your belly.",
        /* 6 */ 'Crawling wallet still beats standing still. Slide tiny notes inside daily. Soon it buys a <bedroom> <house_type> on the <location_zone> and waves bye-bye to curfew. Baby wallet becomes big boss!',
        /* 7 */ "Seeds in pocket grow better than seeds in Mum's cupboard. Sow them in a savings pot and water with hustle. They sprout into a <bedroom> <house_type> on the <location_zone>. Freedom smells like fresh paint.",
        /* 8 */ 'Sprouts beat seeds—they prove growth is real. Show the family the green shoots in your bank app. Next picture will be you in front of a <bedroom> <house_type> on the <location_zone>. Say cheese and hold the keys!',
        /* 9 */ "Charging battery equals charging freedom. Keep the cable of discipline connected. When the bar turns green you'll pack into your own <bedroom> <house_type> on the <location_zone>. Party lights come on instantly. Curfew off forever!",
      ],
    },
  },

  /* ─────────────────── 4. BOOST EARNINGS (index-aligned) ─────────────────── */
  {
    maxYears: Infinity,
    emoji: '4.png',
    label: 'You are in Boost Earnings Mode',
    /* descriptions[ i ] ↔ summaries.*[ i ]  (10 each) */
    descriptions: [
      /* 0 */ 'Your new house dream is still far, but you fit get them if you fit make extra money.',
      /* 1 */ 'Your wallet is slim like a broom; add more hustles to make it fat.',
      /* 2 */ 'Side-gig fit serve as your engine oil; if oil no dey, engine go knock.',
      /* 3 */ 'Plenty jollof rice dey sweet, but more savings in your account is even sweeter.',
      /* 4 */ 'Your dream house still dey craw; boost your earnings to make it run.',
      /* 5 */ 'Free rent can be your cheat code to save more, use it to level up cash.',
      /* 6 */ 'Use your phone as a mini-office; let it guide you toward making more money.',
      /* 7 */ 'Bad debt drags like Lagos traffic; clear your road, then zoom off.',
      /* 8 */ 'You fit start with small plot first, mansion later. Start planting your savings seed now.',
      /* 9 */ 'Every “awoof” alert belongs in your bank account, not sneakers or new clothes',
    ],

    summaries: {
      /* ————————— RENTING ————————— */
      rent: [
        /* 0 */ 'Your map says “Treasure ahead!” but coins are few. Grab a weekend hustle and pour every profit into the house jar. Soon a bright <bedroom> <house_type> on the <location_zone> will pop up on your map. Keep walking with purpose, <first_name>. X marks the doorway!',
        /* 1 */ 'Slim broom wallets sweep nothing. Thicken it with gigs like tutoring or baking cupcakes. Each naira jumps into a deposit for a <bedroom> <house_type> in <location_zone>. Stay sweeping money, not dust, and keys wave <timeline_phrase>.',
        /* 2 */ 'Engines need oil; dreams need side gigs. Try graphics design or ride-share and watch the meter tick. Funnel every gain toward a <bedroom> <house_type> in <location_zone>. When the oil is full the engine zooms straight to your new gate.',
        /* 3 */ "Party rice tastes good but disappears fast. Cook savings stew instead, it will stay hot forever. Skip two parties and you're closer to buying a <bedroom> <house_type> on the <location_zone>. Your tummy and wallet will both cheer!",
        /* 4 */ "Your dream house is jogging ahead; boost earnings so you can sprint and overtake. Sell old gadgets or babysit neighbourhood pets. Soon you'll high-five your new <bedroom> <house_type> in <location_zone>. Winning lap ends <timeline_phrase>.",
        /* 5 */ 'Free rent is a secret weapon—stash what others spend on landlords. Direct those naira into a land kitty and watch it hatch keys. A sweet <bedroom> <house_type> in <location_zone> will call your name. Cheat codes feel awesome when they buy bricks!',
        /* 6 */ "Your phone isn't just for memes; turn it into a mini-office. Design flyers, edit videos, or teach online. All earnings slide into a deposit for a <bedroom> <house_type> on the <location_zone>. One swipe at a time, ownership loads.",
        /* 7 */ 'Bad debt slows you like traffic on Third Mainland. Pay it off, clear the lane, then speed toward property. Fresh cash can then chase a <bedroom> <house_type> in <location_zone>. Traffic light turns green when debt turns zero.',
        /* 8 */ 'Plant money seeds in a small plot first. Lease it, farm it, or just watch the value grow. Later trade up to a bigger <bedroom> <house_type> on the <location_zone>. Gardens of wealth start with one tiny seed.',
        /* 9 */ 'Every “Awoof” alert should jump into your account, not your sneakers. When the account is fat it buys land, not laces. Keep feeding it and a shiny <bedroom> <house_type> in <location_zone> appears. Fashion fades, property stays fresh forever.',
      ],

      /* ————————— ALREADY OWNS ————————— */
      own: [
        /* 0 */ 'Map shows more treasure chests ahead. Airbnb that spare room or start a weekend tour business. Extra gold funds another <bedroom> <house_type> on the <location_zone>. Your portfolio compass keeps pointing to “More!”',
        /* 1 */ 'Slim wallet? Let rent from House A do push-ups. Refinance smartly and funnel muscle money into House B. A fit <bedroom> <house_type> in <location_zone> joins the squad <timeline_phrase>. Flex level up!',
        /* 2 */ 'Side gigs are oil even for landlords. Host workshops, sell e-books, or flip thrift items. All profits turbo-charge your down-payment. Soon, another <bedroom> <house_type> on the <location_zone> will be in your name.',
        /* 3 */ "Skip two luxury lunches, invest the savings. Add rent cheques and the stew turns into cement. Pour foundation for a <bedroom> <house_type> in <location_zone>. That's how big chefs cook wealth.",
        /* 4 */ 'Dream property jogging? You sprint with equity. Pull a slice from house one, pair with fresh cash, and overtake. Before long you unlock a <bedroom> <house_type> in <location_zone>. Trophy = rent alerts.',
        /* 5 */ 'Free rent from parents once helped—now free rent from tenants will. Let their payments pad the kitty. Next stop: sparkling <bedroom> <house_type> on the <location_zone>. Cheat code upgraded!',
        /* 6 */ 'Turn phone hustle into empire fuel. List current house on short-let platforms during holidays. Extra income races into deposit zone and buys a new <bedroom> <house_type> in <location_zone>. Holiday money becomes everyday rent.',
        /* 7 */ 'Debt is traffic even for landlords. Restructure, clear lane, refinance. The open road ends at a fresh <bedroom> <house_type> on the <location_zone>. Your convoy grows longer.',
        /* 8 */ 'Plant seeds on a budget plot, let rent water them. Trade upward into a grander <bedroom> <house_type> in <location_zone>. Real-estate farming is the new agriculture—harvests come in rent cheques.',
        /* 9 */ 'Awoof alerts from past flips funded sneakers once; now they fund ceilings. Stack them till deposit pot overflows. Grab another <bedroom> <house_type> on the <location_zone>. Walk lightly, earn heavy!',
      ],

      /* ————————— FAMILY / FRIENDS ————————— */
      family: [
        /* 0 */ 'Treasure is easier to find when your pockets jingle. Offer weekend chores, design birthday cards, or bake cupcakes. Funnel every coin toward a <bedroom> <house_type> on the <location_zone>. Soon you move from free room to throne room.',
        /* 1 */ 'Slim wallet? No shame—just feed it. Sell old toys or tutor math. The fattened wallet buys bricks in <location_zone>. Bigger wallet, bigger smile, bigger space.',
        /* 2 */ 'Side gigs are superhero capes for family dwellers. Start one today and stash the profit. When the cape flutters long enough it lands you a <bedroom> <house_type> in <location_zone>. Hero moves!',
        /* 3 */ 'Swap party rice for savings stew twice a month. Watch the stew thicken into a down-payment. A tasty <bedroom> <house_type> on the <location_zone> will soon be yours to season. Yum plus freedom!',
        /* 4 */ 'Your dream jogs past chores and curfew. Boost earnings with online surveys or mini-importation. Cash sprints ahead and unlocks a <bedroom> <house_type> on the <location_zone>. You finish the race on your own couch.',
        /* 5 */ 'Free sofa is cheat code; use saved rent to level up. Stuff every naira into a kitty marked “My Keys.” The kitty morphs into a <bedroom> <house_type> in <location_zone>. Cheat code complete—next level unlocked!',
        /* 6 */ 'Turn your phone into an ATM. Do voice-overs, sell stickers, edit videos. Each pay-out feeds the house jar until it buys a <bedroom> <house_type> on the <location_zone>. Ding! Cash dispensed, keys received.',
        /* 7 */ 'Bad debt drags even free lodgers. Clear it by selling unused gadgets. Fresh breeze appears on the money road and points to a <bedroom> <house_type> in <location_zone>. Now you can zoom past curfew.',
        /* 8 */ 'Plant a money seed on a tiny plot through co-op savings. Let it grow into bricks. Trade it up for a <bedroom> <house_type> on the <location_zone>. Seed today, castle tomorrow.',
        /* 9 */ "Awoof alerts love sneakers, but sneakers don't build rooms. Park the alerts in your bank account instead. Soon a cozy <bedroom> <house_type> in <location_zone> pops out. Fashion fades—property stays fly forever.",
      ],
    },
  },
];
