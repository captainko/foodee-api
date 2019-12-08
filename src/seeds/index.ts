// lib
import mongoose = require('mongoose');
import async = require('async');
import faker = require('faker');
import _ = require('lodash');
// app
import { User, IUser } from "../models/user.model";
import { DB_URI } from '../environment';
import { Image, IImage } from '../models/image.model';
import { Recipe } from '../models/recipe.model';

interface IUserData {
  username: string;
  isVerified: boolean;
  admin: boolean;
  password: string;
  email: string;
  img: string;
  recipes: {
    created: IRecipeData[],
    saved: IRecipeData[],
  };
  collec_: ICollectionData;
}

interface IRecipeData {
  name?: string;
  description?: string;
  category?: string;
  createdBy?: string;
  servings?: number;
  time?: number;
  tags?: string[];
  banners?: string[];
  ingredients?: { quantity: string, ingredient: string }[];
  methods?: string[];
}
interface ICollectionData { }

const CATEGORIES = [
  'Bake',
  'Breakfast',
  'Cookies',
  'Smoothy',
];
const SERVINGS = [1, 2, 4, 8, 16];

const users: IUserData[] = [
  {
    username: 'foodee',
    admin: true,
    email: 'foodeeapplication@gmail.com',
    collec_: [],
    img: faker.internet.avatar(),
    isVerified: true,
    password: 'foodee123',
    recipes: {
      created: [{
          name:'A classic sponge cake',
          banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/aclassicspongecakewi_9406_16x9.jpg'],
          createdBy:'foodee',
          category:'Cake',
          description:'Diana shows you how to bake a perfect sponge cake with a creamy passion fruit filling',
          servings:8,
          tags:['cake'],
          time:60,
          ingredients:[
            {quantity:'175g / 6oz',ingredient:'self-raising flour'},
            {quantity:'1 rounded tsp',ingredient:'baking powder'},
            {quantity:'3 large',ingredient:'eggs'},
            {quantity:'175g/6oz',ingredient:'very soft butter'},
            {quantity:'175g/6oz',ingredient:'golden caster sugar'},
            {quantity:'½ tsp',ingredient:'vanilla extract'},
            {quantity:'a little sifted',ingredient:'icing sugar'},
          ],
          methods:[
            'Preheat the oven to 170C/325F/Gas 3.',
            'Take a very large mixing bowl, put the flour and baking powder in a sieve and sift it into the bowl, holding the sieve high to give it a good airing as it goes down. Now all you do is simply add all the other cake ingredients (except the icing sugar) to the bowl and, provided the butter is really soft, just go in with an electric hand whisk and whisk everything together until you have a smooth, well-combined mixture, which will take about one minute. If you do not have an electric hand whisk, you can use a wooden spoon, using a little bit more effort. What you will now end up with is a mixture that drops off a spoon when you give it a tap on the side of the bowl. If it seems a little too stiff, add a little water and mix again.',
            'Now divide the mixture between the two tins, level it out and place the tins on the centre shelf of the oven. The cakes will take 30-35 minutes to cook, but do not open the oven door until 30 minutes have elapsed.',
            'To test whether the cakes are cooked or not, touch the centre of each lightly with a finger: if it leaves no impression and the sponges spring back, they are ready.',
            'Next, remove them from the oven, then wait about five minutes before turning them out on to a wire cooling rack. Carefully peel off the base papers, which is easier if you make a fold in the paper first, then pull it gently away without trying to lift it off. Now leave the sponges to get completely cold, then add the filling.',
            'To make this, first slice the passion fruit into halves and, using a tsp, scoop all the flesh, juice and seeds into a bowl.',
            'Next, in another bowl, combine the mascarpone, fromage frais, sugar and vanilla extract, using a balloon whisk, which is the quickest way to blend them all together. After that, fold in about two-thirds of the passion fruit.',
            'Now place the first sponge cake on the plate or cake stand you are going to serve it on, then spread half the filling over it, drizzle the rest of the passion fruit over that, then spread the remaining filling over the passion fruit. Lastly, place the other cake on top, press it gently so that the filling oozes out at the edges, then dust the surface with a little sifted icing sugar.'
          ]  
      },
    {
        name:'Bunting cake',
        banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/bunting_cake_35577_16x9.jpg'],
        createdBy:'foodee',
        category:'Cake',
        description:'This charming colourful sponge cake is decorated with beautiful bunting, easily made with straws and scraps of cute fabric.',
        servings:10,
        tags:['cake'],
        time:60,
        ingredients:[
          {quantity: '375g/13oz',ingredient:' butter or margarine'},
          {quantity: '375g/13oz',ingredient:'unrefined caster sugar'},
          {quantity: '6 large ',ingredient:'free-range eggs'},
          {quantity: '2 tsp',ingredient:'vanilla extract'},
          {quantity: '375g/13oz',ingredient:'self-raising flour'},
          {quantity: '2-3 tbsp',ingredient:'milk'},
          {quantity: 'few drops',ingredient:'blue food colouring'},
          {quantity: 'few drops',ingredient:'red food colouring'},
        ],
        methods:[
          'For the sponge layers, preheat the oven to 180C/160C Fan/Gas 4. Grease and line the base of three 18cm/7in cake tins with baking paper.',
          'Cream the butter and sugar together in a bowl until pale and fluffy. Beat in the eggs, a little at a time, and stir in the vanilla extract. Fold in the flour using a large metal spoon, adding a little extra milk if necessary.',
          'Divide the mixture equally into three mixing bowls. Add a few drops of blue colouring into one bowl and mix gently to get an even colour. Add red food coluring to the other bowl and again mix for an even colour. Leave the third mix plain.',
          'Spoon the cake mixtures into the three cake tins and gently spread out with a spatula. Bake for 20-25 minutes, or until golden-brown on top and a skewer inserted into the middle comes out clean.',
          'Remove from the oven and set aside for five minutes, then remove from the tin and peel off the paper. Place onto a wire rack to cool completely.',
          'For the frosting, fill a large bowl with cold water. Pour 100ml/3½fl oz water into a pan and add 250g/9oz caster sugar. Heat gently and stir until the sugar dissolves, then bring the mixture to the boil. Use a damp pastry brush to wash down any sugar crystals on the side of the pan. Boil the mixture rapidly, without stirring it, until it reaches 121C/250F (use a kitchen thermometer for this).',
          'Preferably using a freestanding mixer, whisk the egg whites until stiff. Start this when the sugar temperature of the syrup gets to about 100C. Gradually whisk in the remaining caster sugar.',
          'As soon as the syrup reaches 121C/250F, plunge the base of the pan into the bowl of cold water, to prevent the syrup from getting any hotter. Only leave the pan in the water for a few seconds or the syrup will get too thick.',
          "Switch the mixer on full speed and gradually pour in the syrup in a thin stream into the middle of the bowl, trying not to get any syrup onto the sides of the bowl or the whisk, as it will set there and won't get mixed in properly. Continue whisking the mixture for about 8-10 minutes until the bowl feels just lukewarm. If the syrup starts to become too thick to pour, return the pan to the hob very briefly.",
          "Gradually whisk in the butter. Then add the salt and vanilla extract. The meringue will collapse a little, and the mixture may look like it's curdled, but keep whisking it until it forms a smooth fluffy buttercream.",
          'Spread the jam over two of the cake layers and top with a layer of frosting. Sandwich the cakes together. Chill in the fridge for 15 minutes. Remove from the fridge and gently cover the whole of the cake with the frosting. Sprinkle with decorating sprinkles if desired.',
          'To make the bunting decoration, take two lengths so doweling and cover with a spiral of coloured string. Tie a length of string across both doweling rods. Cut 5cm/2in lengths of ribbon or diamond-shape bits of fabric. Fold the bunting flags over the string and glue to secure. Gently ease the doweling into the cake and you have a lovely sweep of bunting.'
        ]
    },
    {
      name:'Tonkatsu pork',
      banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/springmisosoup_72270_16x9.jpg'],
      category:'Soup',
      createdBy:'foodee',
      description:'Miso soup is deliciously savoury and comforting. With a good quality stock, this dish takes only a few minutes.',
      servings:4,
      tags:['soup'],
      time:40,
      ingredients:[
        {quantity:'20g/¾oz',ingredient:'instant dashi'},
        {quantity:'800ml/1½ ',ingredient:'pints boiling water'},
        {quantity:'4',ingredient:'asparagus spears '},
        {quantity:'2 tbsp ',ingredient:' white or red miso paste'},
        {quantity:'1 tbsp',ingredient:'mirin ('},
        {quantity:'1 tbsp',ingredient:'soy sauce'},
        {quantity:'200g/7oz',ingredient:'silken tofu'},
      ],
      methods:[
        'Put the dashi or bouillon powder with the boiling water in a saucepan, and stir well.',
        'Finely slice the asparagus on the diagonal and add to the pan. Simmer for three minutes.',
        'Place the miso paste in a small bowl and add a ladleful of the hot broth, whisking with a small whisk to get rid of any lumps. When smooth, slowly pour the mixture back into the saucepan, whisking constantly.',
        'Add the mirin, soy sauce and silken bean curd. Heat through gently, without boiling.',
        'Serve in small lacquered soup bowls.',
      ]
    },
    {
      name:'Mango smoothie',
      banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/mangosmoothie_86438_16x9.jpg'],
      category:'Smoothie',
      createdBy:'foodee',
      servings:2,
      tags:['Smoothie'],
      time:30,
      description:'A refreshing smoothie that is super simple to make. The perfect way to cool down after a hot curry.',
      ingredients:[
        {quantity:'2',ingredient:'Indian Alphonso mangoes'},
        {quantity:'250–300ml/9–10½ fl oz',ingredient:'cold milk'},
        {quantity:'½–1 tsp',ingredient:'runny honey'},
        {quantity:'some',ingredient:'ice cubes'},
      ],
      methods:[
        "Stand one of the mangoes upright with the narrow end facing you. Slice off the 'cheeks' on either side of the stone and slice these in half lengthwise.",
        'Cut around the stone to take off as much flesh as possible, capturing all the running juices in a bowl.',
        'Remove the skin by peeling or cutting the fruit carefully off it. Repeat with the other mango. Discard the skin and purée the flesh and juice in a food processor or blender.',
        'Add the milk and honey and combine until it becomes a thick smooth mass. Chill until ready to drink. Add the ice cubes and serve straight from the fridge. A little goes a long way, so serve in small glasses.'
      ]
    },
    {
      name:'Veggie stir-fried noodles (Yasai yaki soba)',
      banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/japanesevegetablesti_92442_16x9.jpg'],
      category:'Noodles',
      createdBy:'foodee',
      description:'Teriyaki and yellow bean sauce add depth to this healthy - and super easy - noodle stir fry.',
      servings:2,
      time:30,
      tags:['Noodles'],
      ingredients:[
        {quantity:'100ml/3½fl oz',ingredient:'ready-made teriyaki sauce'},
        {quantity:'4½ tbsp',ingredient:'yellow bean sauce'},
        {quantity:'1',ingredient:' lemongrass stalk'},
        {quantity:'1 tbsp',ingredient:'freshly grated root ginger'},
        {quantity:'200g/7oz',ingredient:'soba noodles'},
        {quantity:'2',ingredient:'free-range eggs'},
        {quantity:'½',ingredient:'green pepper'},
        {quantity:'½',ingredient:'red pepper'},
        {quantity:'1',ingredient:'Onion'},
        {quantity:'8',ingredient:'spring onions'},
        {quantity:'10',ingredient:' mushrooms'},
        {quantity:'2',ingredient:' garlic cloves'},
        {quantity:'handful',ingredient:'fresh beansprouts'},
        {quantity:'4 tbsp',ingredient:' ready-made teriyaki sauce'},
        {quantity:'3 tbsp',ingredient:'vegetable oil'},
        {quantity:'½ tsp',ingredient:' sesame seeds'},
      ],
      methods:[
        'For the yaki soba dressing, bring the teriyaki sauce, yellow bean sauce, lemongrass and ginger to the boil in a small pan, stirring well.',
        'Reduce the heat until the mixture is just simmering, then continue to simmer for 8-10 minutes, or until the mixture has thickened. Set aside until ready to serve.',
        'Meanwhile, for the noodles, cook the noodles in a large pot of boiling water for 2-3 minutes, or until just tender. Drain well, then refresh under cold running water until the noodles are completely cold.',
        'In a bowl, mix together the eggs, peppers, onion, spring onions, mushrooms, garlic and bean sprouts until the vegetables are coated in the eggs. Stir in the teriyaki sauce until well combined.',
        'Heat the oil in a wok over a medium heat. Add the egg and vegetable mixture and the cooked, cold noodles, and stir-fry for 3-4 minutes, or until the noodles have warmed through and the eggs and vegetables are cooked through.',
        'To serve, divide the vegetables and noodles equally between two serving bowls. Drizzle over the yaki soba dressing. Sprinkle over the sesame seeds, if using.'
      ]
    },
    {
      name:'Simple miso, tofu and mushroom ramen',
      banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/simple_miso_tofu_and_03158_16x9.jpg'],
      category:'Noodles',
      createdBy:'foodee',
      description:'Serve the family something different for dinner: a rich miso and mushroom broth with golden tofu and soft-boiled eggs.',
      servings:4,
      time:30,
      tags:['Noodles'],
      ingredients:[
        {quantity:'15g/½oz',ingredient:'dried wild mushrooms'},
        {quantity:'1.4 litres/2½',ingredient:'pints just-boiled water'},
        {quantity:'2 tbsp',ingredient:'dark soy sauce'},
        {quantity:'1',ingredient:'vegetable stock cube'},
        {quantity:'4 tbsp',ingredient:'brown miso paste'},
        {quantity:'200g/7oz',ingredient:'medium dried egg noodles'},
        {quantity:'396g',ingredient:'pack firm tofu, drained, dried, cut into 8 rectangular slices'},
        {quantity:'2-3 tsp',ingredient:' sunflower oil'},
        {quantity:'4',ingredient:'large free-range eggs'},
        {quantity:'150g/5oz',ingredient:' chestnut mushrooms'},
        {quantity:'2',ingredient:'pak choi'},
        {quantity:'100g/3½oz',ingredient:'fresh beansprouts'},
        {quantity:'6',ingredient:'spring onions'},
        {quantity:'50g/2oz',ingredient:'roasted cashew nuts'},
        {quantity:'some',ingredient:'dried flaked chillies,'}
      ],
      methods:[
        'Put the dried mushrooms in a large, heavy-based saucepan and cover with the water. Add the soy sauce, stock cube and miso paste and stir until the stock cube has dissolved. Set aside for 30 minutes to rehydrate and infuse.',
        'Meanwhile, half-fill a saucepan with water and bring to the boil. Add the noodles and cook for 3-4 minutes, or until just tender, stirring occasionally to break up the strands. Drain well, then rinse under running water until cold.',
        'Half-fill the same pan with water and bring to the boil. Add the eggs to the boiling water and cook for 5 minutes.',
        'Heat 2 teaspoons of the oil in a large, non-stick frying pan over a medium heat. Add the tofu pieces and fry carefully for 3-4 minutes on each side, or until pale golden-brown on both sides. Turn off the heat but keep the pan on the hob so that the tofu stays warm.',
        'Stir the noodles into the mushroom broth and bring to the boil. Reduce the heat until the mixture is simmering, add the chestnut mushrooms and pak choi and continue to simmer for a further 2-3 minutes. Stir in the beansprouts and spring onions, remove from the heat.',
        'Drain the eggs then rinse under cold water. Crack and peel off the shells, cut in half.',
        'Divide the broth, noodles and vegetables between 4 serving bowls. Top with the tofu and eggs. Sprinkle over the cashew nuts and chilli flakes. Season with extra soy sauce.'
      ]
    },
    {
      name:'okonomiyaki',
      banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/easy_okonomiyaki_78828_16x9.jpg'],
      category:'Pancakes',
      createdBy:'foodee',
      description:'These easy traditional Japanese fritter-like pancakes are great for using up a head of white cabbage. Serve with okonomiyaki sauce, Japanese mayonnaise or your favourite Asian hot sauce.',
      servings:2,
      tags:['Pancake'],
      time:30,
      ingredients:[
        {quantity:'1½ tbsp ',ingredient:'tomato ketchup'},
        {quantity:'½ tbsp',ingredient:'Worcestershire sauce'},
        {quantity:'2 tsp',ingredient:'runny honey'},
        {quantity:'1 tsp',ingredient:'dark soy sauce'},
        {quantity:'3',ingredient:'large free-range eggs'},
        {quantity:'3 tbsp',ingredient:'plain flour'},
        {quantity:'½ tsp',ingredient:'sea salt'},
        {quantity:'½ tsp',ingredient:'dark soy sauce'},
        {quantity:'½ tsp',ingredient:'toasted sesame oil'},
        {quantity:'q',ingredient:'large spring onions'},
        {quantity:'275g/9¾oz',ingredient:'white cabbage'},
        {quantity:'some',ingredient:'sunflower oil'},
      ],
      methods:[
        'For the okonomiyaki sauce, whisk together the tomato ketchup, Worcestershire sauce, honey and dark soy sauce in a small bowl until combined. Set aside',
        'To make the okonomiyaki batter, whisk together the eggs, flour, salt, soy sauce and toasted sesame oil until smooth.',
        'Fold the spring onions and cabbage into the batter until everything is well coated.',
        'Heat enough oil to just cover the bottom of a large frying pan over a medium–high heat until shimmering. Line a warmed plate with a couple of sheets of kitchen paper.',
        'Spoon some of the cabbage mixture into the pan into pancake shapes that are about the size of your palm. Press down with the back of the spoon and fry until golden-brown on each side, flipping halfway. Transfer the pancakes to the kitchen paper to drain.',
        'Fry in batches until you’ve run out of mixture – you should get about eight pancakes.',
        'Serve the pancakes drizzled with the okonomiyaki sauce.'
      ]
    },
    {
      name:'Vietnamese beef pho',
      banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/vietnamese_beef_pho_22510_16x9.jpg'],
      category:'Noodles',
      createdBy:'foodee',
      description:'Beef pho is a popular street food from Vietnam, with its delicious combination of fresh ingredients and a spicy, rich stock.',
      servings:6,
      time:120,
      tags:['Noodles'],
      ingredients:[
        {quantity:'1.5kg/3lb 5oz',ingredient:'beef shin'},
        {quantity:'2kg/4lb 8oz',ingredient:'beef bones'},
        {quantity:'1',ingredient:'large onion'},
        {quantity:'5cm/2in ',ingredient:'piece fresh root ginger'},
        {quantity:'1 tsp',ingredient:' fennel seeds'},
        {quantity:'1 tsp',ingredient:'black peppercorns'},
        {quantity:'3',ingredient:'star anise'},
        {quantity:'5cm/2in',ingredient:'piece cinnamon stick'},
        {quantity:'4',ingredient:'cloves'},
        {quantity:'2',ingredient:'bay leaves'},
        {quantity:'200g/7oz',ingredient:'flat rice noodles (banh pho)'},
        {quantity:'1',ingredient:'large carrot'},
        {quantity:'bunch',ingredient:'spring onions'},
        {quantity:'300g/10½oz',ingredient:'beansprouts'},
        {quantity:'250g/9oz ',ingredient:'rump or sirloin steak'},
        {quantity:'1–2 tbsp',ingredient:'fish sauce'},
        {quantity:'small bunch',ingredient:'fresh coriander'},
        {quantity:'small bunch',ingredient:'fresh mint'},
        {quantity:'handful',ingredient:'fresh basil leaves'},
        {quantity:'some',ingredient:'salt and freshly ground black pepper'},
        {quantity:'some',ingredient:'fresh coriander, mint and basil leaves'},
        {quantity:'2',ingredient:'limes'},
        {quantity:'few',ingredient:'Thai chillies'},
        {quantity:'some',ingredient:'chilli oil or sauce such as sriracha'},
        {quantity:'some',ingredient:'hoisin sauce (optional)'},
      ],
      methods:[
        'For the stock, preheat the oven to 220C/200C Fan/Gas 7. Put the beef shin, bones, onion and ginger in a large roasting tin. Roast in the oven for 1 hour, or until the onion looks quite charred and everything is well browned.',
        'Put the shin and bones in a large saucepan. Slice the ginger and add that to the saucepan with the onion. Cover with around 4 litres/7 pints water. Bring to the boil, skimming off any grey coloured foam on top.',
        'While you are waiting for the water to come to the boil, put the roasting tin over direct heat on a hob and deglaze with a little water. Scrape up any brown bits from the bottom of the pan. When you have finished skimming the top of the water of the saucepan, add the scraped bits and all of the spices to the pan.',
        'Simmer very slowly, partially covered, for between 3–5 hours, until the meat is tender and the stock has a depth of colour. Strain the stock into a new pan. Strip the meat from the shin and add into the pan, discarding the rest of the solids. Season with salt and pepper, bring to the boil and leave to simmer.',
        'Meanwhile, cook the noodles in a separate saucepan of salted boiling water, according to the packet instructions.',
        'Add the carrot to the beef stock and simmer for 3 minutes. Add the spring onions, beansprouts, and fish sauce and simmer for a further minute. Check seasoning and add a dash more fish sauce if preferred. Add the herbs.',
        'Divide the noodles between warmed bowls and ladle over some soup, top with the steak slices and ladle over more soup. The hot soup will lightly cook the steak. Serve with herbs, lime wedges, chilli, chilli oil and hoisin sauce, if using.',
      ],
    },
    {
      name:'Chashu pork ramen',
      banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/microwave_soy_salmon_07689_16x9.jpg'],
      category:'Noodles',
      createdBy:'foodee',
      servings:1,
      tags:['Noodles'],
      time:40,
      description:'A seriously quick and healthy salmon noodle dinner made in the microwave. Perfect for speedy suppers.',
      ingredients:[
        {quantity:'1',ingredient:'salmon fillet'},
        {quantity:'2 tbsp',ingredient:'orange juice, fresh or from concentrate'},
        {quantity:'1 tbsp',ingredient:'soy sauce'},
        {quantity:'1 tsp',ingredient:'honey'},
        {quantity:'1',ingredient:'nest of noodles'},
        {quantity:'2 tbsp',ingredient:'frozen peas'},
        {quantity:'1',ingredient:' spring onion, finely sliced'},
        {quantity:'2 tbp',ingredient:'sesame seeds'},
      ],
      methods:[
        'Put the salmon in a microwaveable bowl. Pour over the orange juice and soy sauce and drizzle over the honey. Microwave for 4 minutes, turning halfway through. Rest in the microwave for a minute before removing, taking care as it might spit',
        'Put the noodles in a microwaveable bowl, cover with boiling water and microwave for 5 minutes, or until cooked to your liking. Add the peas and set aside for a few minutes until the peas have defrosted. Drain the water.',
        'Place the salmon on top of the noodles and pour over the sauce. Sprinkle with spring onions and sesame seeds, if using.'
      ]
    },
    {
      name:'Chicken and sweetcorn noodles',
      banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/chicken_and_sweetcorn_44908_16x9.jpg'],
      category:'Noodles',
      createdBy:'foodee',
      description:'Make your own easy and healthy pot noodles. Put them in a lidded jar and take to work to revolutionise lunch times.',
      servings:1,
      time:40,
      tags:['Noodles'],
      ingredients:[
        {quantity:'40g/1½oz',ingredient:'nest fine egg noodles'},
        {quantity:'¼',ingredient:'chicken stock pot'},
        {quantity:'1 tsp',ingredient:'soy sauce'},
        {quantity:'½',ingredient:'red chilli, finely chopped'},
        {quantity:'25g/1oz',ingredient:'tinned sweetcorn, drained'},
        {quantity:'25g/1oz',ingredient:'cooked roast chicken, shredded'},
        {quantity:'25g/1oz',ingredient:'baby spinach leaves, roughly chopped'},
        {quantity:'½',ingredient:'Lime,zest and juice'},
        {quantity:'some',ingredient:'sea salt and freshly ground black pepper'},
      ], 
      methods:[
        'Put the noodles into the bottom of a heatproof bowl or jar, then add all the remaining ingredients, except for the lime zest and juice.',
        'Pour over enough boiling water to just cover the ingredients. Cover with a lid or cling film and set aside for 10 minutes.',
        'Add the lime zest and juice, stir well and season with salt and pepper.',
      ],
    },
    {
      name:'Crispy fish fingers',
      banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/crispy_fish_fingers_34974_16x9.jpg'],
      category:'fish food',
      createdBy:'foodee',
      description:'These quick and easy fish fingers are baked in the oven rather than fried for a healthier dish.',
      servings:2,
      time:30,
      tags:['Fish'],
      ingredients:[
        {quantity:'1-2 tbsp',ingredient:'vegetable oil'},
        {quantity:'1',ingredient:'slice day-old bread, grated'},
        {quantity:'2 tbsp',ingredient:'quick-cook dried polenta'},
        {quantity:'some',ingredient:'freshly ground black pepper'},
        {quantity:'3 tbsp',ingredient:'plain flour'},
        {quantity:'some',ingredient:'pinch paprika'},
        {quantity:'1',ingredient:'free-range egg'},
        {quantity:'½',ingredient:'lemon, juice only'},
        {quantity:'1',ingredient:'white fish fillet'},
      ],
      methods:[
        'Preheat the oven to 220C/450F/Gas 7. Line a baking tray with baking parchment and brush the parchment all over with a little vegetable oil.',
        'In a bowl, mix together the breadcrumbs and polenta, and season well with freshly ground black pepper.',
        'Put the plain flour into another bowl and season with the paprika. Beat the egg in a bowl.',
        'Squeeze the lemon juice over the strips of fish.',
        'Roll each strip of fish first in the flour mixture, then dip it into the beaten egg, then coat it in the polenta mixture. Place each fish finger onto the prepared baking tray.',
        'Drizzle a little more vegetable oil onto each fish finger, then bake in the oven for 10-12 minutes, or until the fish is cooked through and the coating is crisp. Serve with salad or steamed vegetables.'
      ]
    },
    
  ],
      saved: [{
      }]
    }
  },
  // {
  //   username: faker.name.firstName() + faker.name.lastName(),
  //   admin: true,
  //   isVerified: true,
  //   collec_: [],
  //   email: faker.internet.email(),
  //   // avatar
  //   img: faker.image.avatar(),
  //   password: faker.internet.password(10),
  //   recipes: {
  //     created: [{
  //       name: faker.name.title(),
  //       category: faker.random.arrayElement(CATEGORIES),
  //       time: faker.random.number({ min: 10, max: 200 }),
  //       servings: faker.random.arrayElement(SERVINGS),
  //       methods: fakeMethods(),
  //       // recipe images
  //       banners: fakeImages(),
  //       description: faker.lorem.sentences(2),
  //       ingredients: [
  //         { quantity: '1/2 spoon', ingredient: 'sugar' },
  //         { quantity: '500g', ingredient: 'beef' },
  //       ]
  //     }],
  //     saved: [],
  //   }
  // },
  // // {
  // //   username: 'Foodee',
  // //   admin: true,
  // //   isVerified: true,

  // // }

  {
    username: 'Amadeus',
    admin: false,
    email: 'AmadesusFood@gmail.com',
    collec_: [],
    img: faker.internet.avatar(),
    isVerified: true,
    password: 'foodee123',
    recipes:{
      created: [{
        name:'Summer fruit smoothie',
        banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/summer_fruit_smoothie_22742_16x9.jpg'],
        category:'smoothie',
        createdBy:'W. Amadeus',
        servings:3,
        time:30,
        tags:['Smoothie'],
        description:"Smoothies are not as sweet as milkshakes and are a little healthier too. If you like yours sweeter, just add more icing sugar. To enjoy this smoothie all year round try it with frozen berries",
        ingredients:[
          {quantity:'225g/8oz',ingredient:'fresh blackberries'},
          {quantity:'225g/8oz',ingredient:'fresh raspberries'},
          {quantity:'225g/8oz',ingredient:'fresh blueberries'},
          {quantity:'1',ingredient:'just-ripe medium banana'},
          {quantity:'150ml/¼',ingredient:'pint natural plain yoghurt'},
          {quantity:'150ml/¼',ingredient:'milk'},
          {quantity:'1 tbsp',ingredient:' icing sugar'},
        ],
        methods:[
          'Measure all the ingredients into a food processor and whiz until smooth. Alternatively use a hand-held blender.',
          'Pour into a tall cool glass and enjoy.',
        ]

      }
      ,
      {
        name:'Cardamom and lemon cookies',
        banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/cardamom_and_lemon_74033_16x9.jpg'],
        category:'Cookie',
        createdBy:'W. Amadeus',
        servings:5,
        tags:['Cookie'],
        time:30,
        description:'We discovered that cardamom is a really popular spice in Norway, used in many cake and biscuit recipes. Some say the spice was first brought back to the country hundreds of years ago by Vikings who worked as mercenaries in what was then Constantinople (now Istanbul). Whatever the truth, Norwegians are certainly keen on their cardamom.',
        ingredients:[
          {quantity:'225g/8 oz',ingredient:'butter'},
          {quantity:'150g/5½ oz',ingredient:'caster sugar'},
          {quantity:'1',ingredient:'lemon'},
          {quantity:'250g/9 oz',ingredient:'plain flour'},
          {quantity:'100g/3½ oz',ingredient:'ground almonds'},
          {quantity:'3 tsp ',ingredient:' ground cardamom'},
        ],
        methods:[
          'Preheat the oven to 190C/375F/Gas 5. Line 2 large baking trays with baking parchment.',
          'Using an electric hand-whisk, beat the butter, sugar and lemon zest together in a large bowl until pale and fluffy.',
          'Beat in the flour, almonds and cardamom until the mixture is well combined and comes together to form a stiff dough.',
          'Roll the dough into 24 balls and place 12 on each baking tray – make sure you leave space between each one.',
          'Press each cookie with a cookie stamp or the bottom of a glass to flatten and leave decorative indentations in the dough.',
          'Bake a tray at a time for 12–14 minutes until the cookies are pale golden brown.',
          'Leave them to cool on the tray for a few minutes, then transfer to a wire rack. They will crisp up as they cool. Store the cookies in an airtight tin and eat within 7 days.',
        ]
      },
      {
        name:'Chocolate cookies with scarlet fruit',
        banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/chocolate_cookies_with_95245_16x9.jpg'],
        category:'Cookie',
        createdBy:'W. Amadeus',
        description:"Amadeus’s soft and fudgy cookies are delicious paired with a handful of summer fruit.",
        servings:2,
        tags:['Cookie'],
        time:30,
        ingredients:[
          {quantity:'200g/7oz',ingredient:' dark chocolate at least 70% cocoa solids'},
          {quantity:'75g/3oz',ingredient:'butter'},
          {quantity:'225g/8oz',ingredient:' light muscovado sugar'},
          {quantity:'2',ingredient:'free-range eggs'},
          {quantity:'some',ingredient:'vanilla extract'},
          {quantity:'50g/2oz',ingredient:'skinned hazelnuts'},
          {quantity:'150g/5¼oz',ingredient:'self-raising flour'},
          {quantity:'handful',ingredient:'fresh cherries and raspberries'},
        ],
        methods:[
          "Preheat the oven to 180C/350F/Gas 4. Snap the chocolate into pieces in a small heatproof glass bowl. Place the bowl over a small pan of simmering water, with the base of the bowl not quite touching the water. Allow the chocolate to melt. Don't be tempted to stir it, other than to occasionally push any unmelted chocolate down into the liquid chocolate to encourage it to melt. Turn off the heat as soon as the chocolate has melted.",
          'Cream the butter and sugar together in a food processor until smooth and creamy. Break the eggs and vanilla extract in a small bowl or jug, whisk just enough to break up the eggs, then add the mixture gradually to the butter and sugar, beating constantly. It is worth scraping down the sides of the bowl with a rubber spatula from time to time to ensure a thorough mixing. Add the melted chocolate and continue to mix.',
          'Toast the hazelnuts in a shallow pan until golden, shaking regularly so they colour evenly. Grind the nuts coarsely using a pestle and mortar to the texture of gravel, then remove half and continue grinding the other half until it resembles fine breadcrumbs. Add the flour and both textures of nut to the cookie mixture. Stop beating as soon as everything is combined.',
          "Place large, heaped tablespoons of the mixture on to a baking tray lined with baking parchment. You should get twelve large biscuits. The mixture is fine to sit for a few minutes if you are cooking them in two batches. Don't be tempted to flatten the cookies, they will do so in the oven anyway.",
          "Bake the cookies for 10-12 minutes. The cookies will have spread and be very soft to the touch. Remove them from the oven and set aside to cool a little. As soon as they are cool enough to move without breaking, slide a palette knife underneath and carefully lift them onto a cooling rack. Serve with a handful of cherries and raspberries."
        ]
      },
      {
        name:'Warm chocolate cakes with clementine sweet cheese',
        banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/warm_chocolate_cakes_54459_16x9.jpg'],
        category:'Cakes',
        createdBy:'foodee',
        description:'If you have time, make the mixture for the chocolate cakes the day before so that the mixture has time to rest in the fridge. Any excess clementine sweet cheese can be stored in the fridge for a few days to serve with other desserts or with fruit.',
        servings:8,
        tags:['Cakes'],
        time:30,
        ingredients:[
          {quantity:'3',ingredient:'free-range egg yolks'},
          {quantity:'3',ingredient:'free-range eggs'},
          {quantity:'200g/7oz',ingredient:'sugar'},
          {quantity:'150g/5½oz',ingredient:' chocolate (70% cocoa solids)'},
          {quantity:'150g/5½oz',ingredient:'unsalted butter, plus extra for greasing'},
          {quantity:'75g/2⅔oz',ingredient:'French T45 flour or Italian 00 flour'},
          {quantity:'240g/8½oz',ingredient:'whipping cream'},
          {quantity:'125g/4½oz',ingredient:'crème fraîche'},
          {quantity:'225g/8oz',ingredient:'cream cheese'},
          {quantity:'125g/4½oz',ingredient:'caster sugar'},
          {quantity:'1',ingredient:'vanilla pod, seeds only'},
          {quantity:'4',ingredient:'clementines, finely grated zest only'},
          {quantity:'2 tsp',ingredient:'orange liqueur, such as Grand Marnier'}, 
        ],
        methods:[
          'In a mixing bowl, add the egg yolks, whole eggs and sugar. Use the paddle attachment on your mixer and combine the ingredients at a slow speed setting. Alternatively, mix using the slow setting on a handheld mixer.',
          'Place an inch of water in a large saucepan and sit a heatproof mixing bowl on top (the bowl should not touch the water). Place the pan on the heat. Once the water is simmering gently, add the chocolate and butter to the bowl and allow to melt gently. Mix to combine and set aside to allow to cool a little.',
          'Once the melted chocolate is cool, stir it into the egg and sugar mixture gently (if the chocolate is too hot it will cook the eggs and cause them to scramble). Gently fold in the flour until fully combined and smooth. Ideally make this mixture the day before use and allow to rest in the fridge.',
          'Meanwhile, make the clementine sweet cheese. Whip the cream in a bowl until soft peaks form when the whisk is removed. Put all the remaining ingredients, except the orange liqueur, into another mixing bowl. Mix until smooth and well combined. Fold this mixture into the whipped cream, and fold in the orange liqueur. Whip until firm enough to hold its shape. Chill until ready to serve.',
          'When ready to bake the cakes, preheat the oven to 180C/160C Fan/Gas 4.',
          'Take your moulds or rings and brush the insides with soft butter, place them in the fridge to set for a few minutes, then brush with more butter and chill again.',
          'If using chef’s rings, place them on baking trays lined with baking paper. Fill the moulds or rings with the cake batter (approximately 80g/2¾oz each).',
          'Bake for 10 minutes, or until the top is set – if it is not, return the cakes to the oven for a few minutes. Rest for 2 minutes, then use a small knife to release the cakes from their moulds or rings. Serve with a generous dollop of clementine sweet cheese.',
        ],
      },
      
      
    
    
    ],
      saved: [],
    }
  }
  ,
  {
    username: 'NamEm',
    admin: false,
    email: 'NamEm@gmail.com',
    collec_: [],
    img: faker.internet.avatar(),
    isVerified: true,
    password: 'foodee123',
    recipes: {
      created: [{
     name:'Chicken stock',
     banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/lightchickenstock_90221_16x9.jpg'],
     category:'Food',
     createdBy:'Nam',
     description:'This homemade chicken stock recipe is a great way to make the most from your roast chicken.',
     tags:['Nam gà'] ,
     time:120,
     servings:4,
     ingredients:[
       {quantity:'1',ingredient:'leek'},
       {quantity:'1',ingredient:'carrot'},
       {quantity:'½',ingredient:'arge onion'},
       {quantity:'several',ingredient:'sprigs fresh thyme'},
       {quantity:'1',ingredient:'head garlic'},
       {quantity:'10 ',ingredient:'black peppercorns'},
       {quantity:'1',ingredient:'chicken carcass'},
       {quantity:'20',ingredient:'chicken wings'},
     ],
     methods:[
       'Put all the ingredients into a stockpot or large heavy-bottomed pan.',
       'Pour in enough cold water to cover the chicken, bring to a simmer and cook, covered, for 1½–2 hours.',
       'After half an hour or so, remove any scum that rises to the surface with a ladle or a large spoon. Repeat as necessary.',
       'At the end of the cooking time, strain the stock, discarding the vegetables and chicken pieces, and allow to cool. You can use the stock as it is, store in the fridge for up to 3 days, or freeze for up to 3 months.',
     ]
      },
      {
        name:'Thai roast chicken',
        banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/thai_roast_chicken_92130_16x9.jpg'],
        category:'Food',
        createdBy:'Nam',
        description:'Lemongrass, ginger and chillies add a wonderfully intense flavour and fragrance to roast chicken in this stunningly simple recipe.',
        tags:['Nam gà'],
        time:120,
        servings:6,
        ingredients:[
          {quantity:'2',ingredient:'sticks lemongrass'},
          {quantity:'50g/1¾oz',ingredient:'ginger,'},
          {quantity:'3 ',ingredient:'spring onions'},
          {quantity:'2',ingredient:'medium red chillies'},
          {quantity:'2',ingredient:'medium yellow chillies'},
          {quantity:'1',ingredient:'medium green chilli'},
          {quantity:'1 tbsp',ingredient:'ground turmeric'},
          {quantity:'200ml/7oz',ingredient:'groundnut oil'},
          {quantity:'1',ingredient:'whole chicken'},
        ],
        methods:[
          'Set the oven to 180C/350F/Gas 4.',
          'Combine all of the ingredients apart from the chicken in a food processor and blend until smooth.',
          'Brush the chicken generously with the spice mix.',
          'Cover the chicken with foil and roast in the oven for 70-80 minutes, or until the juices run clear when the chicken is pierced with a skewer – the cooking time will depend on the size of the chicken. Remove the foil half way through to allow the skin to crisp up.',
          'Leave to rest for 15 minutes covered in foil before serving.',
        ]
      }
    ],
      saved: [],
    }
  },
];

function fakeImages(n = 4): string[] {
  return _.range(faker.random.number({ min: 1, max: n }))
    .map(() => faker.image.food());
}

function fakeMethods(): string[] {
  return _.range(faker.random.number({ min: 1, max: 10 }))
    .map(() => faker.lorem.sentence());
}

new Promise((res) => {
  console.log(DB_URI)
  mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true , ssl: false})
    .then(() => {
      async.parallel(users.map((user) => (done) => {
        async.waterfall([
          // create profile picture
          (cb) => {
            Image.create({
              url: user.img,
              type: 'profile',
            })
              .then((image) => cb(null, image))
              .catch((err) => cb(err));
          },
          // create new user
          function(image: IImage, cb) {
            const newUser = new User({
              username: user.username,
              email: user.email,
              isVerified: user.isVerified,
              admin: user.admin,
              image_url: image.id,

            });
            newUser.setPassword(user.password);
            newUser.save()
              .then((user) => cb(null, user))
              .catch((err) => cb(err, null));
          },

          // create recipes
          (newUser: IUser, cb) => {
            const recipes = user.recipes.created;
            const createRecipeFuncs = recipes.map((r) => (rDone) => {

              Promise.all(r.banners.map(b => {
                return Image.create({
                  url: b,
                  type: 'recipe',
                });
              }))
                .then(async images => {
                  const recipe = new Recipe(r);
                  recipe.banners = images.map(x => x.id);
                  // @ts-ignore
                  recipe.createdBy = newUser.id;
                  return await recipe.save();
                })
                .then(newRecipe => rDone(null, newRecipe))
                .catch(err => rDone(err, null));

            });
            async.series(createRecipeFuncs, (err, recipes) => {
              console.log(err);
              console.log(recipes);
              cb(recipes);
            });
          }
        ], (err, results) => { console.log(err); done(); });
      }), (err, result) => res(result));
    })
    .catch(err => {
      console.error(err);
    }); 

}).then((value) => {
  console.log(value);
  return mongoose.disconnect();
}).catch(x => console.error(x));