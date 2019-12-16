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
        name: 'A classic sponge cake',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/aclassicspongecakewi_9406_16x9.jpg'],
        createdBy: 'foodee',
        category: 'Cake',
        description: 'Diana shows you how to bake a perfect sponge cake with a creamy passion fruit filling',
        servings: 8,
        tags: ['cake'],
        time: 60,
        ingredients: [
          { quantity: '175g / 6oz', ingredient: 'self-raising flour' },
          { quantity: '1 rounded tsp', ingredient: 'baking powder' },
          { quantity: '3 large', ingredient: 'eggs' },
          { quantity: '175g/6oz', ingredient: 'very soft butter' },
          { quantity: '175g/6oz', ingredient: 'golden caster sugar' },
          { quantity: '½ tsp', ingredient: 'vanilla extract' },
          { quantity: 'a little sifted', ingredient: 'icing sugar' },
        ],
        methods: [
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
        name: 'Bunting cake',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/bunting_cake_35577_16x9.jpg'],
        createdBy: 'foodee',
        category: 'Cake',
        description: 'This charming colourful sponge cake is decorated with beautiful bunting, easily made with straws and scraps of cute fabric.',
        servings: 10,
        tags: ['cake'],
        time: 60,
        ingredients: [
          { quantity: '375g/13oz', ingredient: ' butter or margarine' },
          { quantity: '375g/13oz', ingredient: 'unrefined caster sugar' },
          { quantity: '6 large ', ingredient: 'free-range eggs' },
          { quantity: '2 tsp', ingredient: 'vanilla extract' },
          { quantity: '375g/13oz', ingredient: 'self-raising flour' },
          { quantity: '2-3 tbsp', ingredient: 'milk' },
          { quantity: 'few drops', ingredient: 'blue food colouring' },
          { quantity: 'few drops', ingredient: 'red food colouring' },
        ],
        methods: [
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
        name: 'Tonkatsu pork',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/springmisosoup_72270_16x9.jpg'],
        category: 'Soup',
        createdBy: 'foodee',
        description: 'Miso soup is deliciously savoury and comforting. With a good quality stock, this dish takes only a few minutes.',
        servings: 4,
        tags: ['soup'],
        time: 40,
        ingredients: [
          { quantity: '20g/¾oz', ingredient: 'instant dashi' },
          { quantity: '800ml/1½ ', ingredient: 'pints boiling water' },
          { quantity: '4', ingredient: 'asparagus spears ' },
          { quantity: '2 tbsp ', ingredient: ' white or red miso paste' },
          { quantity: '1 tbsp', ingredient: 'mirin (' },
          { quantity: '1 tbsp', ingredient: 'soy sauce' },
          { quantity: '200g/7oz', ingredient: 'silken tofu' },
        ],
        methods: [
          'Put the dashi or bouillon powder with the boiling water in a saucepan, and stir well.',
          'Finely slice the asparagus on the diagonal and add to the pan. Simmer for three minutes.',
          'Place the miso paste in a small bowl and add a ladleful of the hot broth, whisking with a small whisk to get rid of any lumps. When smooth, slowly pour the mixture back into the saucepan, whisking constantly.',
          'Add the mirin, soy sauce and silken bean curd. Heat through gently, without boiling.',
          'Serve in small lacquered soup bowls.',
        ]
      },
      {
        name: 'Mango smoothie',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/mangosmoothie_86438_16x9.jpg'],
        category: 'Smoothie',
        createdBy: 'foodee',
        servings: 2,
        tags: ['Smoothie'],
        time: 30,
        description: 'A refreshing smoothie that is super simple to make. The perfect way to cool down after a hot curry.',
        ingredients: [
          { quantity: '2', ingredient: 'Indian Alphonso mangoes' },
          { quantity: '250–300ml/9–10½ fl oz', ingredient: 'cold milk' },
          { quantity: '½–1 tsp', ingredient: 'runny honey' },
          { quantity: 'some', ingredient: 'ice cubes' },
        ],
        methods: [
          "Stand one of the mangoes upright with the narrow end facing you. Slice off the 'cheeks' on either side of the stone and slice these in half lengthwise.",
          'Cut around the stone to take off as much flesh as possible, capturing all the running juices in a bowl.',
          'Remove the skin by peeling or cutting the fruit carefully off it. Repeat with the other mango. Discard the skin and purée the flesh and juice in a food processor or blender.',
          'Add the milk and honey and combine until it becomes a thick smooth mass. Chill until ready to drink. Add the ice cubes and serve straight from the fridge. A little goes a long way, so serve in small glasses.'
        ]
      },
      {
        name: 'Veggie stir-fried noodles (Yasai yaki soba)',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/japanesevegetablesti_92442_16x9.jpg'],
        category: 'Noodles',
        createdBy: 'foodee',
        description: 'Teriyaki and yellow bean sauce add depth to this healthy - and super easy - noodle stir fry.',
        servings: 2,
        time: 30,
        tags: ['Noodles'],
        ingredients: [
          { quantity: '100ml/3½fl oz', ingredient: 'ready-made teriyaki sauce' },
          { quantity: '4½ tbsp', ingredient: 'yellow bean sauce' },
          { quantity: '1', ingredient: ' lemongrass stalk' },
          { quantity: '1 tbsp', ingredient: 'freshly grated root ginger' },
          { quantity: '200g/7oz', ingredient: 'soba noodles' },
          { quantity: '2', ingredient: 'free-range eggs' },
          { quantity: '½', ingredient: 'green pepper' },
          { quantity: '½', ingredient: 'red pepper' },
          { quantity: '1', ingredient: 'Onion' },
          { quantity: '8', ingredient: 'spring onions' },
          { quantity: '10', ingredient: ' mushrooms' },
          { quantity: '2', ingredient: ' garlic cloves' },
          { quantity: 'handful', ingredient: 'fresh beansprouts' },
          { quantity: '4 tbsp', ingredient: ' ready-made teriyaki sauce' },
          { quantity: '3 tbsp', ingredient: 'vegetable oil' },
          { quantity: '½ tsp', ingredient: ' sesame seeds' },
        ],
        methods: [
          'For the yaki soba dressing, bring the teriyaki sauce, yellow bean sauce, lemongrass and ginger to the boil in a small pan, stirring well.',
          'Reduce the heat until the mixture is just simmering, then continue to simmer for 8-10 minutes, or until the mixture has thickened. Set aside until ready to serve.',
          'Meanwhile, for the noodles, cook the noodles in a large pot of boiling water for 2-3 minutes, or until just tender. Drain well, then refresh under cold running water until the noodles are completely cold.',
          'In a bowl, mix together the eggs, peppers, onion, spring onions, mushrooms, garlic and bean sprouts until the vegetables are coated in the eggs. Stir in the teriyaki sauce until well combined.',
          'Heat the oil in a wok over a medium heat. Add the egg and vegetable mixture and the cooked, cold noodles, and stir-fry for 3-4 minutes, or until the noodles have warmed through and the eggs and vegetables are cooked through.',
          'To serve, divide the vegetables and noodles equally between two serving bowls. Drizzle over the yaki soba dressing. Sprinkle over the sesame seeds, if using.'
        ]
      },
      {
        name: 'Simple miso, tofu and mushroom ramen',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/simple_miso_tofu_and_03158_16x9.jpg'],
        category: 'Noodles',
        createdBy: 'foodee',
        description: 'Serve the family something different for dinner: a rich miso and mushroom broth with golden tofu and soft-boiled eggs.',
        servings: 4,
        time: 30,
        tags: ['Noodles'],
        ingredients: [
          { quantity: '15g/½oz', ingredient: 'dried wild mushrooms' },
          { quantity: '1.4 litres/2½', ingredient: 'pints just-boiled water' },
          { quantity: '2 tbsp', ingredient: 'dark soy sauce' },
          { quantity: '1', ingredient: 'vegetable stock cube' },
          { quantity: '4 tbsp', ingredient: 'brown miso paste' },
          { quantity: '200g/7oz', ingredient: 'medium dried egg noodles' },
          { quantity: '396g', ingredient: 'pack firm tofu, drained, dried, cut into 8 rectangular slices' },
          { quantity: '2-3 tsp', ingredient: ' sunflower oil' },
          { quantity: '4', ingredient: 'large free-range eggs' },
          { quantity: '150g/5oz', ingredient: ' chestnut mushrooms' },
          { quantity: '2', ingredient: 'pak choi' },
          { quantity: '100g/3½oz', ingredient: 'fresh beansprouts' },
          { quantity: '6', ingredient: 'spring onions' },
          { quantity: '50g/2oz', ingredient: 'roasted cashew nuts' },
          { quantity: 'some', ingredient: 'dried flaked chillies,' }
        ],
        methods: [
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
        name: 'okonomiyaki',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/easy_okonomiyaki_78828_16x9.jpg'],
        category: 'Pancakes',
        createdBy: 'foodee',
        description: 'These easy traditional Japanese fritter-like pancakes are great for using up a head of white cabbage. Serve with okonomiyaki sauce, Japanese mayonnaise or your favourite Asian hot sauce.',
        servings: 2,
        tags: ['Pancake'],
        time: 30,
        ingredients: [
          { quantity: '1½ tbsp ', ingredient: 'tomato ketchup' },
          { quantity: '½ tbsp', ingredient: 'Worcestershire sauce' },
          { quantity: '2 tsp', ingredient: 'runny honey' },
          { quantity: '1 tsp', ingredient: 'dark soy sauce' },
          { quantity: '3', ingredient: 'large free-range eggs' },
          { quantity: '3 tbsp', ingredient: 'plain flour' },
          { quantity: '½ tsp', ingredient: 'sea salt' },
          { quantity: '½ tsp', ingredient: 'dark soy sauce' },
          { quantity: '½ tsp', ingredient: 'toasted sesame oil' },
          { quantity: 'q', ingredient: 'large spring onions' },
          { quantity: '275g/9¾oz', ingredient: 'white cabbage' },
          { quantity: 'some', ingredient: 'sunflower oil' },
        ],
        methods: [
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
        name: 'Vietnamese beef pho',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/vietnamese_beef_pho_22510_16x9.jpg'],
        category: 'Noodles',
        createdBy: 'foodee',
        description: 'Beef pho is a popular street food from Vietnam, with its delicious combination of fresh ingredients and a spicy, rich stock.',
        servings: 6,
        time: 120,
        tags: ['Noodles'],
        ingredients: [
          { quantity: '1.5kg/3lb 5oz', ingredient: 'beef shin' },
          { quantity: '2kg/4lb 8oz', ingredient: 'beef bones' },
          { quantity: '1', ingredient: 'large onion' },
          { quantity: '5cm/2in ', ingredient: 'piece fresh root ginger' },
          { quantity: '1 tsp', ingredient: ' fennel seeds' },
          { quantity: '1 tsp', ingredient: 'black peppercorns' },
          { quantity: '3', ingredient: 'star anise' },
          { quantity: '5cm/2in', ingredient: 'piece cinnamon stick' },
          { quantity: '4', ingredient: 'cloves' },
          { quantity: '2', ingredient: 'bay leaves' },
          { quantity: '200g/7oz', ingredient: 'flat rice noodles (banh pho)' },
          { quantity: '1', ingredient: 'large carrot' },
          { quantity: 'bunch', ingredient: 'spring onions' },
          { quantity: '300g/10½oz', ingredient: 'beansprouts' },
          { quantity: '250g/9oz ', ingredient: 'rump or sirloin steak' },
          { quantity: '1–2 tbsp', ingredient: 'fish sauce' },
          { quantity: 'small bunch', ingredient: 'fresh coriander' },
          { quantity: 'small bunch', ingredient: 'fresh mint' },
          { quantity: 'handful', ingredient: 'fresh basil leaves' },
          { quantity: 'some', ingredient: 'salt and freshly ground black pepper' },
          { quantity: 'some', ingredient: 'fresh coriander, mint and basil leaves' },
          { quantity: '2', ingredient: 'limes' },
          { quantity: 'few', ingredient: 'Thai chillies' },
          { quantity: 'some', ingredient: 'chilli oil or sauce such as sriracha' },
          { quantity: 'some', ingredient: 'hoisin sauce (optional)' },
        ],
        methods: [
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
        name: 'Chashu pork ramen',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/microwave_soy_salmon_07689_16x9.jpg'],
        category: 'Noodles',
        createdBy: 'foodee',
        servings: 1,
        tags: ['Noodles'],
        time: 40,
        description: 'A seriously quick and healthy salmon noodle dinner made in the microwave. Perfect for speedy suppers.',
        ingredients: [
          { quantity: '1', ingredient: 'salmon fillet' },
          { quantity: '2 tbsp', ingredient: 'orange juice, fresh or from concentrate' },
          { quantity: '1 tbsp', ingredient: 'soy sauce' },
          { quantity: '1 tsp', ingredient: 'honey' },
          { quantity: '1', ingredient: 'nest of noodles' },
          { quantity: '2 tbsp', ingredient: 'frozen peas' },
          { quantity: '1', ingredient: ' spring onion, finely sliced' },
          { quantity: '2 tbp', ingredient: 'sesame seeds' },
        ],
        methods: [
          'Put the salmon in a microwaveable bowl. Pour over the orange juice and soy sauce and drizzle over the honey. Microwave for 4 minutes, turning halfway through. Rest in the microwave for a minute before removing, taking care as it might spit',
          'Put the noodles in a microwaveable bowl, cover with boiling water and microwave for 5 minutes, or until cooked to your liking. Add the peas and set aside for a few minutes until the peas have defrosted. Drain the water.',
          'Place the salmon on top of the noodles and pour over the sauce. Sprinkle with spring onions and sesame seeds, if using.'
        ]
      },
      {
        name: 'Chicken and sweetcorn noodles',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/chicken_and_sweetcorn_44908_16x9.jpg'],
        category: 'Noodles',
        createdBy: 'foodee',
        description: 'Make your own easy and healthy pot noodles. Put them in a lidded jar and take to work to revolutionise lunch times.',
        servings: 1,
        time: 40,
        tags: ['Noodles'],
        ingredients: [
          { quantity: '40g/1½oz', ingredient: 'nest fine egg noodles' },
          { quantity: '¼', ingredient: 'chicken stock pot' },
          { quantity: '1 tsp', ingredient: 'soy sauce' },
          { quantity: '½', ingredient: 'red chilli, finely chopped' },
          { quantity: '25g/1oz', ingredient: 'tinned sweetcorn, drained' },
          { quantity: '25g/1oz', ingredient: 'cooked roast chicken, shredded' },
          { quantity: '25g/1oz', ingredient: 'baby spinach leaves, roughly chopped' },
          { quantity: '½', ingredient: 'Lime,zest and juice' },
          { quantity: 'some', ingredient: 'sea salt and freshly ground black pepper' },
        ],
        methods: [
          'Put the noodles into the bottom of a heatproof bowl or jar, then add all the remaining ingredients, except for the lime zest and juice.',
          'Pour over enough boiling water to just cover the ingredients. Cover with a lid or cling film and set aside for 10 minutes.',
          'Add the lime zest and juice, stir well and season with salt and pepper.',
        ],
      },
      {
        name: 'Crispy fish fingers',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/crispy_fish_fingers_34974_16x9.jpg'],
        category: 'fish food',
        createdBy: 'foodee',
        description: 'These quick and easy fish fingers are baked in the oven rather than fried for a healthier dish.',
        servings: 2,
        time: 30,
        tags: ['Fish'],
        ingredients: [
          { quantity: '1-2 tbsp', ingredient: 'vegetable oil' },
          { quantity: '1', ingredient: 'slice day-old bread, grated' },
          { quantity: '2 tbsp', ingredient: 'quick-cook dried polenta' },
          { quantity: 'some', ingredient: 'freshly ground black pepper' },
          { quantity: '3 tbsp', ingredient: 'plain flour' },
          { quantity: 'some', ingredient: 'pinch paprika' },
          { quantity: '1', ingredient: 'free-range egg' },
          { quantity: '½', ingredient: 'lemon, juice only' },
          { quantity: '1', ingredient: 'white fish fillet' },
        ],
        methods: [
          'Preheat the oven to 220C/450F/Gas 7. Line a baking tray with baking parchment and brush the parchment all over with a little vegetable oil.',
          'In a bowl, mix together the breadcrumbs and polenta, and season well with freshly ground black pepper.',
          'Put the plain flour into another bowl and season with the paprika. Beat the egg in a bowl.',
          'Squeeze the lemon juice over the strips of fish.',
          'Roll each strip of fish first in the flour mixture, then dip it into the beaten egg, then coat it in the polenta mixture. Place each fish finger onto the prepared baking tray.',
          'Drizzle a little more vegetable oil onto each fish finger, then bake in the oven for 10-12 minutes, or until the fish is cooked through and the coating is crisp. Serve with salad or steamed vegetables.'
        ]
      },
      {
        name: 'Mango lassi',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/mangolassi_74038_16x9.jpg'],
        category: 'Smoothie',
        createdBy: 'Foodee',
        description: "When it's hot outside, a frosty mango lassi is sweet and refreshing. Enjoy as an indulgent breakfast smoothie or a fresh dessert.",
        servings: 2,
        tags: ['Smoothie'],
        time: 30,
        ingredients: [
          { quantity: '100ml/3½fl oz', ingredient: 'single cream' },
          { quantity: '200ml/7fl oz', ingredient: 'full fat milk' },
          { quantity: '400ml/14fl oz', ingredient: 'natural unsweetened yoghurt' },
          { quantity: '400ml/14fl oz', ingredient: 'mango pulp' },
          { quantity: '4 tsp', ingredient: 'caster sugar' },

        ],
        methods: [
          'Blend the ingredients together and serve with ice. Easy!',

        ]
      },
      {
        name: 'Watermelon cooler',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/watermelon_cooler_57906_16x9.jpg'],
        category: 'Smoothie',
        createdBy: 'Foodee',
        description: "You don't need a juicer or blender to make this tasty watermelon drink. Make it a few hours in advance as it's best served chilled.",
        servings: 2,
        tags: ['Smoothie'],
        time: 30,
        ingredients: [
          { quantity: '550g/1lb 4oz', ingredient: 'watermelon, peeled, chopped' },
          { quantity: '¼', ingredient: 'lemon, juice only' },
          { quantity: 'some', ingredient: 'fresh mint leaves, to serve' },

        ],
        methods: [
          'Mash the watermelon in a bowl, then stir in the lemon juice.',
          'Sieve the watermelon into a jug and press down gently on the pulp to extract all the juice.',
          'Pour the juice into glasses filled with ice and garnish with the mint.',
        ]
      },
      {
        name: 'Virgin Mary',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/virginmary_78294_16x9.jpg'],
        category: 'Smoothie',
        createdBy: 'foodee',
        description: 'Make Bloody Mary a little less sinful with this non-alcoholic version. We promise it still tastes great.',
        servings: 1,
        tags: ['Smothie'],
        time: 30,
        ingredients: [
          { quantity: '200ml/7fl oz', ingredient: 'tomato passata' },
          { quantity: '2', ingredient: 'spring onions, finely chopped' },
          { quantity: '1', ingredient: 'lemon, juiced' },
          { quantity: '½ tsp', ingredient: 'Tabasco sauce' },
          { quantity: '½ tsp', ingredient: 'Worcestershire sauce' },
          { quantity: '55g/2oz', ingredient: 'ice cubes' },
          { quantity: '1 tbsp', ingredient: 'chives, chopped' },

        ],
        methods: [
          'In a blender, mix the passata, spring onions, lemon juice, Worcestershire sauce, Tabasco sauce and ice cubes. Blend for two minutes, or until smooth.',
          'Pour into a tall glass and garnish with chopped chives.',

        ]
      },
      {
        name: 'Cardamom and beetroot smoothie sundae',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/cardamom_and_beetroot_04997_16x9.jpg'],
        category: 'Smoothie',
        createdBy: 'foodee',
        description: 'This healthy vegan smoothie is packed full of vitamins and given a gentle kick with eastern spices.',
        servings: 2,
        tags: ['Smoothie'],
        time: 2,
        ingredients: [
          { quantity: '1', ingredient: 'young beetroot' },
          { quantity: '125ml/4fl oz', ingredient: 'coconut milk, chilled' },
          { quantity: '1', ingredient: 'ripe banana' },
          { quantity: '2', ingredient: 'cardamom seeds' },
          { quantity: '7', ingredient: 'ice cubes' },
          { quantity: '1 tsp', ingredient: 'vanilla extract' },
          { quantity: 'some', ingredient: 'tiny pinch sea salt' },
          { quantity: '2 tbsp', ingredient: 'freshly squeezed lemon juice' },
          { quantity: 'some', ingredient: 'cacao nibs or sesame seeds, to garnish (optional)' },

        ],
        methods: [
          'Blend the beetroot with two-thirds of the banana and all of the remaining ingredients until completely smooth.',
          'Slice the remaining banana.',
          'Divide the smoothie between two tall glasses. Garnish with the banana slices and a sprinkling of sesame seeds or cacao nibs.',
        ]
      },
      {
        name: 'Eye-health smoothie',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/smoothie_29786_16x9.jpg'],
        category: 'Smoothie',
        createdBy: 'foodee',
        description: 'This nutritious smoothie contains lots of vitamins that promote eye health.',
        servings: 3,
        tags: ['Smoothie'],
        time: 10,
        ingredients: [
          { quantity: '65g/2¼oz', ingredient: 'cooked kale' },
          { quantity: '1 tbsp', ingredient: 'almond butter' },
          { quantity: '½ tsp', ingredient: 'wheatgerm oil' },
          { quantity: '160ml/5½fl oz', ingredient: 'semi-skimmed milk' },
          { quantity: '½', ingredient: 'small banana' },
          { quantity: '90g/3¼oz', ingredient: 'kiwi fruit, peeled' },
          { quantity: '85g/3oz', ingredient: 'tinned pineapple chunks in water' },
          { quantity: '½ ', ingredient: 'medium apple, peeled and cored' },
          { quantity: '5g', ingredient: 'fresh mint leaves' },
          { quantity: '½', ingredient: 'lime' },
        ],
        methods: [
          'In a food processor or high-powered blender, combine the kale, almond butter, wheatgerm oil and small amount of the milk. Blend to a smooth paste',
          'Add the remaining ingredients (including the rest of the milk) and continue to blend until smooth.',
        ]
      },
      {
        name: 'Sangria',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/sangria_93847_16x9.jpg'],
        category: 'Smoothie',
        createdBy: 'foodee',
        description: 'Mix an ice-cold jug of this traditional Spanish sangria recipe: a perfect cocktail for hot summer days.',
        servings: 4,
        tags: ['Smoothie'],
        time: 30,
        ingredients: [
          { quantity: '3', ingredient: 'parts red wine' },
          { quantity: '1', ingredient: 'part orange juice' },
          { quantity: '2', ingredient: 'parts lemonade' },
          { quantity: 'some', ingredient: 'ice' },
          { quantity: 'some', ingredient: 'fresh mint' },
          { quantity: 'some', ingredient: 'sliced fruit such as oranges and lemons' },
        ],
        methods: [
          'Mix all the ingredients together in a large jug and add more red wine, orange juice or lemonade according to taste and desired strength.',
          'Pour into glasses, garnish with mint sprigs and fruit.',
        ]
      },
      {
        name: 'Egg nog with cherries',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/eggnog_9370_16x9.jpg'],
        category: 'Drink',
        createdBy: 'foodee',
        description: 'Enjoy this classic homemade Christmas tipple laced with brandy to keep out the winter cold.',
        servings: 2,
        tags: ['Drink'],
        time: 40,
        ingredients: [
          { quantity: '1140ml/2', ingredient: 'pints whole milk' },
          { quantity: '6', ingredient: 'free-range eggs' },
          { quantity: '50g/2oz', ingredient: 'caster sugar' },
          { quantity: '1', ingredient: 'vanilla pod, split' },
          { quantity: '20', ingredient: 'fresh cherries, stones removed and halved' },
          { quantity: '200ml/7fl', ingredient: 'oz brandy' },
          { quantity: 'some', ingredient: 'cocoa powder, for dusting' },
        ],
        methods: [
          'Place the milk, eggs, sugar and vanilla pod in a medium pan and heat gently, without boiling, until the mixture thickens enough to coat the back of a spoon.',
          'The egg nog can be chilled at this stage or served hot.',
          'To serve, scatter the cherries in the bottom of each serving glass. Divide the brandy between the glasses and pour the egg nog over. Dust with cocoa powder and serve',
        ]
      },
      {
        name: 'Vegan hot coconut drink',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/horlixier_49938_16x9.jpg'],
        category: 'Drink',
        createdBy: 'foodee',
        description: "Foodee's low-sugar take on a bedtime drink is an indulgent night-time treat.",
        servings: 6,
        tags: ['Drink'],
        time: 40,
        ingredients: [
          { quantity: '2 tbsp', ingredient: 'carob (available from health food stores)' },
          { quantity: '1 tsp', ingredient: 'vanilla extract' },
          { quantity: '½ tsp', ingredient: 'almond extract' },
          { quantity: '1-2 tsp', ingredient: 'date syrup (available from delicatessens or online specialists) or maple syrup' },
          { quantity: '1-2 tsp', ingredient: 'maca powder' },
          { quantity: '¼', ingredient: 'tsp salt' },
          { quantity: '400g', ingredient: 'tin full-fat coconut milk' },
        ],
        methods: [
          'Blend all of the ingredients and 300ml/10½fl oz water together in a food processor until super-smooth and well combined.',
          'Transfer the mixture to a pan and warm over a gentle heat.',
          'Serve immediately in mugs.',
        ]
      },
      {
        name: 'Irish coffee',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/irishcoffee_8924_16x9.jpg'],
        category: 'Drink',
        createdBy: 'foodee',
        description: "Don't stir the cream into the coffee, but leave it on top so the drink looks like a glass of stout. For a change, you can use your favourite liqueur instead of whiskey.",
        servings: 2,
        tags: ['Drink'],
        time: 30,
        ingredients: [
          { quantity: '2', ingredient: 'good glugs of Irish whiskey' },
          { quantity: '2 tsp', ingredient: 'demerara sugar' },
          { quantity: 'enough', ingredient: 'hot strong coffee to fill the glasses' },
          { quantity: '2 heaped tbsp', ingredient: 'whipped cream' },
        ],
        methods: [
          'Warm two coffee glasses and add a glug of whiskey to each.',
          'Stir in a teaspoon of sugar into each glass. Top up with coffee and stir well.',
          'Float the whipped cream on top and serve.',
        ],
      },
      {
        name: 'Christmas cocktail',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/bbc_four_cocktail_68933_16x9.jpg'],
        category: 'Drink',
        createdBy: 'foodee',
        description: 'Get the party started with this zesty and zingy festive drink.',
        servings: 1,
        tags: ['Drink'],
        time: 30,
        ingredients: [
          { quantity: '50ml/2fl oz', ingredient: 'good-quality bourbon whiskey' },
          { quantity: '1 tbsp', ingredient: 'cherry juice' },
          { quantity: '1 tsp', ingredient: 'cherry brandy' },
          { quantity: '1 tbsp', ingredient: 'orange liqueur' },
          { quantity: '35ml/1¼fl oz', ingredient: 'pink grapefruit juice' },
          { quantity: 'some', ingredient: 'dash of grapefruit bitters (10 drops)' },
          { quantity: 'some', ingredient: 'dash of Peychauds bitters (10 drops)' },
          { quantity: 'some', ingredient: 'ice, to serve' },
          { quantity: 'aome', ingredient: 'grenadine, for frosting' },
          { quantity: 'some', ingredient: 'caster sugar, for frosting' },
          { quantity: 'some', ingredient: 'ribbon of grapefruit zest' },
          { quantity: '1', ingredient: "red chilli, preferably bird's eye" },

        ],
        methods: [
          'To frost the rim of the cocktail glass, pour a little grenadine into a shallow bowl and put a little sugar on a plate. Dip the rim of the glass in the grenadine and then coat with the sugar.',
          'Put all the cocktail ingredients in a cocktail shaker and shake.',
          'Put ice in the glass and pour over the cocktail.',
          'Decorate with the chilli and grapefruit.',
        ],
      },
      {
        name: 'Classic champagne cocktail',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/classicchampagnecock_84499_16x9.jpg'],
        category: 'Drink',
        createdBy: 'foodee',
        description: 'This decadent cocktail of champagne laced with cognac is perfect for special occasions. Treat yourself this Christmas.',
        servings: 1,
        tags: ['Drink'],
        time: 30,
        ingredients: [
          { quantity: '1', ingredient: 'white sugar cube' },
          { quantity: '2', ingredient: 'dashes bitters' },
          { quantity: '20ml/¾fl oz', ingredient: 'cognac' },
          { quantity: 'enough', ingredient: 'champagne to fill the glass' },

        ],
        methods: [
          'Place the sugar cube onto a spoon and add the bitters.',
          'Drop the soaked sugar cube into a champagne flute and add the cognac.',
          'Top up the glass with champagne and serve.',
        ],
      },
      {
        name: 'Bellini cocktail',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/bellinicocktail_67941_16x9.jpg'],
        category: 'Drink',
        createdBy: 'foodee',
        description: "This famous cocktail was invented at Harry's Bar, Venice, in 1934. The combination of peach juice and fizz is almost acceptable at breakfast.",
        servings: 4,
        tags: ['Drink'],
        time: 30,
        ingredients: [
          { quantity: '2', ingredient: 'ripe peaches' },
          { quantity: 'some', ingredient: 'chilled champagne or sparkling wine' },
          { quantity: '2', ingredient: 'chilled champagne glasses' },

        ],
        methods: [
          "Place the peaches in a small blender and purée until totally smooth. This can be done well in advance and kept in the fridge. Spoon half into the chilled champagne glasses and slowly top up with champagne, stirring as you pour. You should ideally have one third peach purée to two thirds champagne. Serve straight away as a pre-dinner drink with the Cupid's Caviar, leaving plenty of time for a second glass each.",
        ],
      },
      {
        name: 'Golden turmeric milk',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/golden_spiced_turmeric_21734_16x9.jpg'],
        category: 'Drink',
        createdBy: 'foodee',
        description: 'Often used in India as an alternative remedy to boost immunity and stave off illness, golden milk is a delicious drink that is nourishing and warming.',
        servings: 1,
        tags: ['Drink'],
        time: 40,
        ingredients: [
          { quantity: '250ml/9fl oz', ingredient: 'full-fat milk or non-dairy milk alternative' },
          { quantity: '½ tsp', ingredient: 'ground turmeric' },
          { quantity: '½ tsp', ingredient: 'finely grated fresh root ginger' },
          { quantity: '1', ingredient: 'star anise' },
          { quantity: '2 tsp', ingredient: 'runny or Manuka honey' },
          { quantity: '½ tsp', ingredient: 'ground cinnamon' },
        ],
        methods: [
          'Put all the ingredients in a small saucepan placed over a medium heat and bring to a boil, stirring often.',
          'Reduce the heat to low and simmer gently for 5–6 minutes. Strain the spiced milk with a fine sieve into a heatproof glass.',
          'Garnish the top with a little sieved cinnamon, if using, and serve immediately.',
        ],
      },
      {
        name: 'Hot chocolate',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/hotchocolate_81425_16x9.jpg'],
        category: 'Drink',
        createdBy: 'foodee',
        description: 'foodee show you how to make a creamy cup of hot chocolate, perfect for a cold winter’s day.',
        servings: 4,
        tags: ['Drink'],
        time: 40,
        ingredients: [
          { quantity: '1', ingredient: 'vanilla pod' },
          { quantity: '1', ingredient: 'cinnamon stick' },
          { quantity: '1 litre/1¾', ingredient: 'pints milk' },
          { quantity: '150g/5½oz', ingredient: 'plain chocolate, chopped into small pieces' },
          { quantity: 'some', ingredient: 'sugar, to taste' },
          { quantity: 'some', ingredient: 'freshly grated nutmeg, for dusting' },
        ],
        methods: [
          'Heat the vanilla pod and seeds, cinnamon stick and milk in a saucepan until boiling',
          'Remove the pan from the heat and add the chocolate pieces, stirring until the chocolate melts.',
          'Whisk the hot chocolate vigorously until frothy on top and add sugar, to taste. Serve with a dusting of nutmeg.',
        ],
      },
      {
        name: 'Orange cake',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/orange_cake_57974_16x9.jpg'],
        category: 'Cake',
        createdBy: 'foodee',
        description: 'This cake is best made the day before serving, and will keep in an airtight tin in a cool place for up to 5 days.',
        servings: 12,
        tags: ['Cake'],
        time: 60,
        ingredients: [
          { quantity: '2', ingredient: 'oranges, diced ' },
          { quantity: '115g/4oz', ingredient: 'margarine, plus extra for greasing' },
          { quantity: '115g/4oz', ingredient: 'sugar' },
          { quantity: '2', ingredient: 'medium free-range eggs, beaten' },
          { quantity: '3 tsp', ingredient: 'baking powder' },
          { quantity: '175g/6oz', ingredient: 'semolina' },
        ],
        methods: [
          'Preheat the oven to 180C/350F/Gas 4. Grease a deep 20cm/8in tin with margarine.',
          'Purée the diced oranges in a food processor, and set aside.',
          'Cream the margarine and sugar in a bowl until light and fluffy. Mix in the eggs and then add the baking powder and semolina. Stir to combine, then fold the orange pulp through the mixture.',
          'Pour the mixture into the prepared tin, and put into the oven. After the first 10 minutes, turn the oven temperature down to 170C/325F/Gas 3 and bake for a further 40 minutes, or until the cake is golden-brown on top and a skewer inserted into the middle comes out clean.',
          'Remove the cake from the oven, and allow to cool in the tin. Once cool, run a knife around the edge of the tin to release the cake, and then turn out. To serve, cut the cake into 12 slices.',
        ],
      },
      {
        name: 'Salted chocolate cake',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/salted_dark_chocolate_16338_16x9.jpg'],
        category: 'Cake',
        createdBy: 'foodee',
        description: "foodee's quick and easy chocolate cake has a gorgeous soured cream ganache and a sprinkle of sea salt that lifts the flavour to another level. This will totally impress at any party or bake sale.",
        servings: 12,
        tags: ['Cake'],
        time: 60,
        ingredients: [
          { quantity: '375g/13oz', ingredient: 'self-raising flour, sifted' },
          { quantity: '50g/1¾oz', ingredient: 'cocoa powder, sifted' },
          { quantity: '325g/11½oz ', ingredient: 'caster sugar' },
          { quantity: '4', ingredient: 'free-range eggs, beaten' },
          { quantity: '375ml/13fl oz', ingredient: 'full-fat milk' },
          { quantity: '250g/9oz', ingredient: 'unsalted butter, melted' },
          { quantity: '200g/7oz', ingredient: 'dark chocolate, melted' },
          { quantity: '2 tsp', ingredient: 'vanilla extract' },
          { quantity: '250g/9oz', ingredient: 'soured cream' },
          { quantity: '400g/14oz ', ingredient: 'milk chocolate, melted' },
          { quantity: '2 tsp', ingredient: 'black or regular sea salt flakes' },
        ],
        methods: [
          'Preheat the oven to 200C/180C Fan/Gas 6. Grease and line two 20cm/8in round cake tins with baking paper.',
          'Place the flour, cocoa, sugar, eggs, milk, butter, melted dark chocolate and vanilla in a large bowl and whisk until smooth.',
          'Evenly divide the mixture between the tins and bake for 35–40 minutes, or until cooked through and a skewer inserted into the middle of each cake comes out clean. Leave to cool slightly in the tins before turning out onto wire racks to cool completely.',
          'Place the soured cream and melted milk chocolate in a large bowl. Stir to combine and refrigerate for 10 minutes, or until the ganache is a firm, spreadable consistency.',
          'Place one of the cakes on a cake stand or plate and trim the top so it is flat. Spread the top of the cake with half of the ganache. Top with the remaining cake and cover the top of that cake with the rest of the ganache. Sprinkle the salt over the top of the cake.',
        ],
      },
      {
        name: 'Gluten-free Christmas cookies',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/gluten-free_cookies_64138_16x9.jpg'],
        category: 'Cookies',
        createdBy: 'foodee',
        description: 'Looking for a great gluten-free biscuit? Get yourself some star cutters in assorted sizes to make pretty Christmas cookies.',
        servings: 4,
        tags: ['Cookies'],
        time: 30,
        ingredients: [
          { quantity: '125g/4½oz', ingredient: 'unsalted butter, at room temperature' },
          { quantity: '125g/4½oz', ingredient: 'caster sugar' },
          { quantity: '½', ingredient: 'unwaxed lemon, zest only' },
          { quantity: '1', ingredient: 'free-range egg, lightly beaten' },
          { quantity: '1 tsp', ingredient: 'vanilla extract' },
          { quantity: '200g/7oz', ingredient: 'gluten-free plain flour, plus extra for rolling' },
          { quantity: '40g/1½oz', ingredient: 'ground almonds' },
          { quantity: '½ tsp', ingredient: 'xanthan gum' },
          { quantity: 'some', ingredient: 'pinch salt' },
          { quantity: 'some', ingredient: 'icing sugar, for dusting' },

        ],
        methods: [
          'Cream together the softened butter and caster sugar in a bowl until pale and light. Add the lemon zest and mix again.',
          'Scrape down the sides of the bowl with a rubber spatula, add the beaten egg and vanilla and mix again until thoroughly combined.',
          'Add the gluten-free flour, ground almonds, xanthan gum and salt and mix until smooth. Bring the dough together into a neat ball using your hands, flatten into a disc, wrap in cling film and chill in the fridge for 1 hour.',
          'Cover two baking trays with baking paper and lightly dust the work surface with gluten-free flour.',
          'Roll the dough out to a thickness of 2–3mm/⅛in and, using the largest cutter stamp, cut out as many shapes from the dough as you can.',
          'Arrange the cookies on the prepared baking trays and, using the smaller cutter, stamp out smaller stars from the middle of each biscuit. Gather the dough off-cuts into a ball and re-roll to make more shapes',
          'Chill the biscuits in the fridge for 30 minutes while you preheat the oven to 170C/150C Fan/Gas 3.',
          'Bake on the middle shelf for about 10 minutes, or until the edge of each biscuit is lightly golden-brown. Leave to cool on the baking tray for about 2–3 minutes before transferring to a wire rack to cool completely.',
          'Dust with icing sugar before serving.',
        ],
      },
      {
        name: 'Spiced oat cookies',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/spicedoatbiscuits_70435_16x9.jpg'],
        category: 'Cookie',
        createdBy: 'foodee',
        description: "At last! A sugar-free cookie! Tender, oaty and gently spiced, you'll never miss the sugar.",
        servings: 12,
        tags: ['Cookies'],
        time: 30,
        ingredients: [
          { quantity: '50g/2oz', ingredient: 'porridge oats' },
          { quantity: '75g/3oz', ingredient: 'wholemeal flour, plus a little extra' },
          { quantity: 'some', ingredient: 'pinch fine sea salt' },
          { quantity: '½ tsp', ingredient: 'bicarbonate of soda' },
          { quantity: '½ tsp', ingredient: 'ground mixed spice' },
          { quantity: '75g/3oz', ingredient: 'baking spread, plus extra for greasing' },
          { quantity: '50g/2oz', ingredient: 'pear or apple spread/purée' },

        ],
        methods: [
          'Preheat the oven to 190C/375F/Gas 5 and grease and flour two baking sheets.',
          'Mix together the oats, flour, salt, bicarbonate of soda and mixed spice.',
          'Cream the margarine in a bowl and beat in the pear and apple spread/purée, a little at a time. Beat in the oat mixture.',
          'Place walnut sized portions of the mixture on a baking sheet, leaving a space of about 5cm/2in round each one. Flatten them slightly, with a fork.',
          'Bake the biscuits for 15 minutes or until they are beginning to turn golden. Leave the biscuits on the baking trays until they are cool and firm.',
        ],
      }

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
    recipes: {
      created: [{
        name: 'Summer fruit smoothie',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/summer_fruit_smoothie_22742_16x9.jpg'],
        category: 'smoothie',
        createdBy: 'W. Amadeus',
        servings: 3,
        time: 30,
        tags: ['Smoothie'],
        description: "Smoothies are not as sweet as milkshakes and are a little healthier too. If you like yours sweeter, just add more icing sugar. To enjoy this smoothie all year round try it with frozen berries",
        ingredients: [
          { quantity: '225g/8oz', ingredient: 'fresh blackberries' },
          { quantity: '225g/8oz', ingredient: 'fresh raspberries' },
          { quantity: '225g/8oz', ingredient: 'fresh blueberries' },
          { quantity: '1', ingredient: 'just-ripe medium banana' },
          { quantity: '150ml/¼', ingredient: 'pint natural plain yoghurt' },
          { quantity: '150ml/¼', ingredient: 'milk' },
          { quantity: '1 tbsp', ingredient: ' icing sugar' },
        ],
        methods: [
          'Measure all the ingredients into a food processor and whiz until smooth. Alternatively use a hand-held blender.',
          'Pour into a tall cool glass and enjoy.',
        ]

      }
        ,
      {
        name: 'Cardamom and lemon cookies',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/cardamom_and_lemon_74033_16x9.jpg'],
        category: 'Cookie',
        createdBy: 'W. Amadeus',
        servings: 5,
        tags: ['Cookie'],
        time: 30,
        description: 'We discovered that cardamom is a really popular spice in Norway, used in many cake and biscuit recipes. Some say the spice was first brought back to the country hundreds of years ago by Vikings who worked as mercenaries in what was then Constantinople (now Istanbul). Whatever the truth, Norwegians are certainly keen on their cardamom.',
        ingredients: [
          { quantity: '225g/8 oz', ingredient: 'butter' },
          { quantity: '150g/5½ oz', ingredient: 'caster sugar' },
          { quantity: '1', ingredient: 'lemon' },
          { quantity: '250g/9 oz', ingredient: 'plain flour' },
          { quantity: '100g/3½ oz', ingredient: 'ground almonds' },
          { quantity: '3 tsp ', ingredient: ' ground cardamom' },
        ],
        methods: [
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
        name: 'Chocolate cookies with scarlet fruit',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/chocolate_cookies_with_95245_16x9.jpg'],
        category: 'Cookie',
        createdBy: 'W. Amadeus',
        description: "Amadeus’s soft and fudgy cookies are delicious paired with a handful of summer fruit.",
        servings: 2,
        tags: ['Cookie'],
        time: 30,
        ingredients: [
          { quantity: '200g/7oz', ingredient: ' dark chocolate at least 70% cocoa solids' },
          { quantity: '75g/3oz', ingredient: 'butter' },
          { quantity: '225g/8oz', ingredient: ' light muscovado sugar' },
          { quantity: '2', ingredient: 'free-range eggs' },
          { quantity: 'some', ingredient: 'vanilla extract' },
          { quantity: '50g/2oz', ingredient: 'skinned hazelnuts' },
          { quantity: '150g/5¼oz', ingredient: 'self-raising flour' },
          { quantity: 'handful', ingredient: 'fresh cherries and raspberries' },
        ],
        methods: [
          "Preheat the oven to 180C/350F/Gas 4. Snap the chocolate into pieces in a small heatproof glass bowl. Place the bowl over a small pan of simmering water, with the base of the bowl not quite touching the water. Allow the chocolate to melt. Don't be tempted to stir it, other than to occasionally push any unmelted chocolate down into the liquid chocolate to encourage it to melt. Turn off the heat as soon as the chocolate has melted.",
          'Cream the butter and sugar together in a food processor until smooth and creamy. Break the eggs and vanilla extract in a small bowl or jug, whisk just enough to break up the eggs, then add the mixture gradually to the butter and sugar, beating constantly. It is worth scraping down the sides of the bowl with a rubber spatula from time to time to ensure a thorough mixing. Add the melted chocolate and continue to mix.',
          'Toast the hazelnuts in a shallow pan until golden, shaking regularly so they colour evenly. Grind the nuts coarsely using a pestle and mortar to the texture of gravel, then remove half and continue grinding the other half until it resembles fine breadcrumbs. Add the flour and both textures of nut to the cookie mixture. Stop beating as soon as everything is combined.',
          "Place large, heaped tablespoons of the mixture on to a baking tray lined with baking parchment. You should get twelve large biscuits. The mixture is fine to sit for a few minutes if you are cooking them in two batches. Don't be tempted to flatten the cookies, they will do so in the oven anyway.",
          "Bake the cookies for 10-12 minutes. The cookies will have spread and be very soft to the touch. Remove them from the oven and set aside to cool a little. As soon as they are cool enough to move without breaking, slide a palette knife underneath and carefully lift them onto a cooling rack. Serve with a handful of cherries and raspberries."
        ]
      },
      {
        name: 'Warm chocolate cakes with clementine sweet cheese',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/warm_chocolate_cakes_54459_16x9.jpg'],
        category: 'Cakes',
        createdBy: 'foodee',
        description: 'If you have time, make the mixture for the chocolate cakes the day before so that the mixture has time to rest in the fridge. Any excess clementine sweet cheese can be stored in the fridge for a few days to serve with other desserts or with fruit.',
        servings: 8,
        tags: ['Cakes'],
        time: 30,
        ingredients: [
          { quantity: '3', ingredient: 'free-range egg yolks' },
          { quantity: '3', ingredient: 'free-range eggs' },
          { quantity: '200g/7oz', ingredient: 'sugar' },
          { quantity: '150g/5½oz', ingredient: ' chocolate (70% cocoa solids)' },
          { quantity: '150g/5½oz', ingredient: 'unsalted butter, plus extra for greasing' },
          { quantity: '75g/2⅔oz', ingredient: 'French T45 flour or Italian 00 flour' },
          { quantity: '240g/8½oz', ingredient: 'whipping cream' },
          { quantity: '125g/4½oz', ingredient: 'crème fraîche' },
          { quantity: '225g/8oz', ingredient: 'cream cheese' },
          { quantity: '125g/4½oz', ingredient: 'caster sugar' },
          { quantity: '1', ingredient: 'vanilla pod, seeds only' },
          { quantity: '4', ingredient: 'clementines, finely grated zest only' },
          { quantity: '2 tsp', ingredient: 'orange liqueur, such as Grand Marnier' },
        ],
        methods: [
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
      {
        name: 'Quick pepperoni pizza',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/quick_pepperoni_pizza_64616_16x9.jpg'],
        category: 'Pizza',
        createdBy: 'foodee',
        tags: ['Pizza'],
        servings: 3,
        time: 30,
        description: 'A quick and easy pizza with no proving required. Tailor the toppings to suit your taste.',
        ingredients: [
          { quantity: '300g/10½oz', ingredient: 'strong white bread flour,' },
          { quantity: '2 tsp', ingredient: 'baking powder' },
          { quantity: '½ tsp', ingredient: 'sea salt' },
          { quantity: '2 tsp', ingredient: 'rapeseed oil' },
          { quantity: '150–175ml/5–6fl oz', ingredient: 'lukewarm water' },
          { quantity: 'some', ingredient: 'freshly ground black pepper' },
          { quantity: '120g/4½oz', ingredient: 'passata' },
          { quantity: '1 tbsp', ingredient: 'tomato purée' },
          { quantity: '½ tsp ', ingredient: 'dried mixed herbs' },
          { quantity: '½ tsp ', ingredient: 'sea salt' },
          { quantity: '1', ingredient: 'mozzarella ball' },
          { quantity: '10', ingredient: 'pepperoni slices' },
          { quantity: '30g/1oz', ingredient: 'cheddar, grated' },
        ],
        methods: [
          'Preheat the oven to 200C/180C Fan/Gas 6 and place a large baking tray upside-down on a shelf.',
          'To make the dough, sift the flour and baking powder into a large bowl. Add the salt and a pinch of pepper, then stir in the oil. Make a well in the centre, then stir in the warm water and mix to a soft dough, drawing the flour in from the side of the bowl a little at a time – you might need to add another 25ml/1fl oz water if the dough is a little dry; you want it to be slightly sticky and soft.',
          'Tip the dough onto a lightly floured work surface and knead for 2 minutes, until smooth and springy',
          'Place a sheet of greaseproof paper on the work surface, then dust with a little flour and place the dough on top of it. Carefully roll the dough out into a 30cm/12in disc, roughly the thickness of a pound coin. Pick the paper up and carefully slide it onto the hot baking tray in the oven. Bake for 3 minutes.',
          'Meanwhile, pour the passata into a bowl, then add the tomato purée, mixed herbs and sea salt and black pepper and mix.',
          'Remove the dough tray from the oven. Cover the base with the tomato sauce, using the back of a spoon, leaving a small gap around the edges of the dough. Scatter the mozzarella over the tomato sauce, then top with the pepperoni and cheddar (you can add any other toppings you fancy at this point – see tips below.)',
          'Bake for 15 minutes, or until the base has puffed up and is cooked through and the cheese is golden and bubbling. Cut into wedges and serve immediately.',
        ]
      },
      {
        name: 'Pizza on toast',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/pizza_on_toast_09337_16x9.jpg'],
        category: 'Pizza',
        createdBy: 'foodee',
        tags: ['Pizza'],
        servings: 1,
        time: 30,
        description: 'Cheese on toast meets pizza in this easy peasy cheesy recipe – add whatever toppings take your fancy.',
        ingredients: [
          { quantity: '1', ingredient: 'thick slice white or brown bread' },
          { quantity: '2 tbsp', ingredient: 'pasta sauce' },
          { quantity: '2 tbsp', ingredient: 'pizza topping' },
          { quantity: '2 tbsp', ingredient: 'tomato salsa' },
          { quantity: '2 tbsp', ingredient: 'passata' },
          { quantity: '30g/1oz', ingredient: 'cheese' },

        ],
        methods: [
          'Preheat the grill to a medium-high setting. Place the bread on a baking tray or grill pan and grill on one side until lightly toasted.',
          'Turn the bread over and spread with the tomato sauce and top with the chorizo, mushrooms, or any other topping. Sprinkle with the cheese.',
          'Return to the grill for a further 2–3 minutes, or until the cheese melts and the toppings are hot.',
        ]
      },
      {
        name: 'Pitta pizzas',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/pitta_pizzas_20075_16x9.jpg'],
        category: 'Pizza',
        createdBy: 'foodee',
        tags: ['Pizza'],
        servings: 12,
        time: 40,
        description: 'Pitta breads make a quick base for these pizzas. Freeze the breads and the sauce in ice-cube trays so you can whip up a pizza in ten minutes.',
        ingredients: [
          { quantity: '2 tbsp', ingredient: 'mild olive oil or sunflower oil' },
          { quantity: '½', ingredient: 'onion, finely chopped' },
          { quantity: '1', ingredient: 'carrot, finely grated' },
          { quantity: '1', ingredient: 'red pepper' },
          { quantity: '2', ingredient: 'garlic cloves, crushed' },
          { quantity: '227g', ingredient: 'tin chopped tomatoes' },
          { quantity: '2 tbsp', ingredient: 'tomato purée' },
          { quantity: '1 tsp', ingredient: 'dried oregano' },
          { quantity: '1', ingredient: 'bay leaf' },
          { quantity: 'some', ingredient: 'salt and freshly ground black pepper' },
          { quantity: '12', ingredient: 'white or wholemeal pitta breads' },
          { quantity: '200g/7oz', ingredient: 'sliced ham, finely chopped' },
          { quantity: '250g/9oz', ingredient: 'grated mozzarella' },
        ],
        methods: [
          'Heat the oil in a large non-stick saucepan over a medium heat. Add the onion, carrot and pepper and fry for 4-5 minutes, stirring regularly, until softened. Add the garlic and fry for 1-2 minutes, stirring regularly.',
          'Add the remaining tomato sauce ingredients and 100ml/3½fl oz water, stir well to combine. Season with salt and pepper. Bring to the boil, then simmer for 18-20 minutes, stirring regularly, until the vegetables are very soft and most of the liquid has evaporated.',
          'Remove the bay leaf, blend to a very smooth purée using a hand-held blender',
          'Preheat the grill to its hottest setting.',
          'Place the pitta breads onto baking trays and spread some of the tomato sauce over each. Sprinkle over the ham and grated mozzarella. (At this point, the pizzas can be frozen on baking trays, then packed into freezer bags, ready for another day.)',
          'Grill the pizzas for 2-3 minutes, or until the bread is piping hot and the cheese has melted and turned golden-brown. Serve immediately'
        ]
      },
      {
        name: 'Veggie pizza',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/veggie_pizzas_63934_16x9.jpg'],
        category: 'Pizza',
        createdBy: 'foodee',
        tags: ['Pizza'],
        servings: 4,
        time: 90,
        description: 'Who said pizza was unhealthy? These veggie pizzas pack winning flavour combinations plus your five-a-day.',
        ingredients: [
          { quantity: '500g/1lb 2oz', ingredient: 'plain flour, plus extra for dusting' },
          { quantity: '7g', ingredient: 'sachet fast-acting dried yeast' },
          { quantity: '8 tbsp', ingredient: 'warm water' },
          { quantity: '1 tbsp', ingredient: 'extra virgin olive oil' },
          { quantity: 'some', ingredient: 'salt' },

          { quantity: '2 tbsp', ingredient: 'olive oil' },
          { quantity: '2', ingredient: 'garlic cloves, thinly sliced' },
          { quantity: '400g', ingredient: 'tin plum tomatoes' },
          { quantity: '1 tbsp', ingredient: 'finely chopped fresh oregano' },
          { quantity: 'some', ingredient: 'freshly ground black pepper' },

          { quantity: '2', ingredient: 'courgettes, cut into matchsticks' },
          { quantity: '2', ingredient: 'garlic cloves, thinly sliced' },
          { quantity: '150g/5½oz', ingredient: 'feta, crumbled' },
          { quantity: '1', ingredient: 'unwaxed lemon' },
          { quantity: '2', ingredient: 'fresh rosemary' },

          { quantity: '30g/1oz', ingredient: 'unsalted butter' },
          { quantity: '2', ingredient: 'red onions' },
          { quantity: 'some', ingredient: 'pinch caster sugar' },
          { quantity: '500g/1lb 2oz', ingredient: 'butternut squash' },
          { quantity: '1 tbsp', ingredient: 'olive oil' },
          { quantity: '150g/5½oz', ingredient: 'Stilton, crumbled' },
          { quantity: 'some', ingredient: 'handful fresh sage leaves' },
        ],
        methods: [
          'To make the pizza dough, measure the flour and yeast into a bowl and add salt to taste. Make a well in the centre and add the warm water and extra virgin olive oil. Mix until it comes together. Turn out the dough onto a work surface and knead for 3 minutes, or until it becomes springy and elastic. Place it in an oiled bowl and cover with cling film. Leave to rise for 45 minutes, or until it doubles in size.',
          'To make the tomato sauce, heat the olive oil in a frying pan over a medium heat and add the garlic. Cook for 1–2 minutes, then add the tomatoes and oregano, breaking up the tomatoes with a wooden spoon. Season with salt and pepper and simmer for 30 minutes, or until thickened. Mash the tomatoes with a potato masher to get a smoother sauce, if necessary.',
          'Preheat the oven to 200°C/180°C Fan/Gas 6.',
          'To make the courgette topping, sprinkle the courgettes with salt and leave in a colander for 30 minutes. Rinse thoroughly, then squeeze them dry with kitchen paper',
          'To make the butternut squash topping, melt the butter in a frying pan over a low heat and add the red onions, sugar and some seasoning. Cover with a lid and cook for 30 minutes, stirring occasionally, until caramelised and soft.',
          'Lay the squash in a roasting tin and drizzle with the olive oil. Roast for 20 minutes, or until tender.',
          'Remove the squash from the oven and turn the temperature up as high as it will go. Place two large baking sheets in the oven.',
          'Once the pizza dough has risen, divide it into four balls and roll each one out on a lightly floured surface to make 25–30cm/10–12in pizza bases.',
          'Heat a heavy-based frying pan over a high heat and, one at a time, put the pizza bases in the pan to brown and cook the bottoms. Remove the hot baking sheets from the oven and place the browned bases on the sheets',
          'Arrange the courgettes on two of the bases. Top with the garlic, feta, lemon and rosemary.',
          'Arrange the squash slices so they radiate out from the centre of the remaining two bases. Spread the caramelised onions over the top and cover with the Stilton and sage leaves.',
          'Bake the pizzas for 8–10 minutes, or until the cheese has melted and they are cooked. Serve',
        ]
      },
      {
        name: 'Chocolate pecan tart',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/chocolate_pecan_tart_86249_16x9.jpg'],
        category: 'American Pie',
        createdBy: 'foodee',
        tags: ['American Pie'],
        servings: 10,
        time: 120,
        description: 'Impress the chocoholic in your life with chocolate shortcrust pastry filled with a rich chocolate and nut filling.',
        ingredients: [
          { quantity: '125g/4½oz', ingredient: 'plain flour' },
          { quantity: '2 tbsp', ingredient: 'icing sugar' },
          { quantity: '2 tbsp', ingredient: 'cocoa powder' },
          { quantity: '1', ingredient: 'medium free-range egg' },
          { quantity: '1 tsp', ingredient: 'lemon juice' },
          { quantity: '135g/4¾oz', ingredient: 'cold unsalted butter' },
          { quantity: '80g/3oz', ingredient: 'dark chocolate' },
          { quantity: '45g/1½oz', ingredient: 'unsalted butter' },
          { quantity: '160g/5¾oz', ingredient: 'granulated sugar' },
          { quantity: '235ml/8¼fl oz', ingredient: 'golden syrup' },
          { quantity: '3', ingredient: 'free-range eggs' },
          { quantity: '1 tsp', ingredient: 'vanilla extract' },
          { quantity: '235g/8¼oz', ingredient: 'pecans, chopped' },
          { quantity: 'some', ingredient: 'vanilla ice cream or double cream, to serve' },
        ],
        methods: [
          'For the pastry, put the flour, icing sugar and cocoa powder into a large bowl and mix them together. Lightly beat the egg with the lemon juice and 2 tablespoons very cold water in a measuring jug with a fork. Set aside',
          'Add the butter to the flour and toss the cubes to coat them in the flour. Rub the butter into the flour, using your fingertips. (Lift your hands above the bowl, rubbing the fat and flour together then letting the crumbs fall back into the bowl. Keep going until the mixture looks like fine breadcrumbs.) Make a well in the centre of the mixture and pour in the egg mixture. Incorporate the liquid into the flour and butter mixture, using one hand. Avoid overworking the dough as this will make your pastry tough. If it is too dry, add a splash more cold water.',
          'When the dough just sticks together in clumps, form it into a ball. Knead it very lightly on a lightly floured surface to bring it together into a smooth dough. Again, don’t overwork it. You can test it by taking a little bit of pastry and rolling it out. If it starts to crack easily, it needs just a touch more kneading to develop the gluten slightly more. Wrap the pastry in cling film and leave it in the fridge to chill for about 30 minutes.',
          'Preheat the oven to 190C/170C Fan/Gas 5. Heat a heavy, flat baking tray.',
          'Roll the pastry out on a floured surface and use it to line a 25cm/10in fluted flan tin. Leave any excess overhanging and prick the base of the pastry using a fork. Chill the pastry for 10 minutes.',
          'Line the pastry case with parchment paper and fill with ceramic baking beans or uncooked rice. Place the tin on the hot baking tray and bake blind for about 15 minutes until set and pale golden-brown. Remove the beans and paper and return to the oven for about 10-12 minutes until the base is cooked. Reduce the oven temperature to 180C/160C Fan/Gas 4.',
          'For the filling, melt the chocolate and the butter together in a heatproof bowl over a pan of simmering water. When melted, set aside to cool slightly.',
          'In a medium saucepan, combine the sugar and golden syrup and bring to the boil, stirring constantly. Set aside to cool.',
          'Beat the eggs in a large bowl, then stir in the chocolate mixture. Whisk in the sugar syrup mixture and thoroughly combine. (It’s important to cool the melted chocolate and sugar syrup or they will scramble the eggs.) Add the vanilla extract and stir in the pecans.',
          'Pour the pecan filling into the baked pastry and bake in the oven for 30-40 minutes until set. Cool and serve with vanilla ice cream or double cream.',
        ]
      },
      {
        name: 'Pecan pie',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/pecanpie_86028_16x9.jpg'],
        category: 'American Pie',
        createdBy: 'foodee',
        tags: ['American Pie'],
        servings: 6,
        time: 120,
        description: "You haven't lived until you've tried our recipe for a classic American pecan pie. Serve with whipped double cream or (even better) vanilla ice cream.",
        ingredients: [
          { quantity: '110g/4oz', ingredient: 'unsalted butter' },
          { quantity: '110g/4oz', ingredient: 'golden syrup' },
          { quantity: '1 tsp', ingredient: 'vanilla extract' },
          { quantity: '3', ingredient: 'free-range eggs, beaten' },
          { quantity: '1 x 245g/8½oz', ingredient: 'blind-baked shortcrust pastry case' },
          { quantity: '285g/10oz', ingredient: 'pecan nuts, halved' },
        ],
        methods: [
          'Preheat the oven to 180C/350F/Gas 4.',
          'Place the butter, golden syrup, vanilla extract and sugar into a heavy-based saucepan over a low heat.',
          'When the butter has melted, remove the pan from the heat and leave to cool for 5-10 minutes.',
          'Add the beaten eggs to the mixture and stir well.',
          'Set aside a small handful of the pecan nuts. Arrange the remaining pecan halves evenly in the pastry case and carefully pour over the syrup mixture',
          'Place into the preheated oven and bake for 40-50 minutes - the pie will be golden-brown, but the filling should still be slightly soft.',
          'Leave the pie to cool on a wire tray. As the pie begins to set, decorate the top with the reserved pecan halves. Serve in slices.',
        ]
      },
      {
        name: 'Key lime pie',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/keylimepie_93185_16x9.jpg'],
        category: 'American Pie',
        createdBy: 'foodee',
        tags: ['American Pie'],
        servings: 8,
        time: 40,
        description: 'This classic American dessert is sure to impress, perfect when you want something different for a dinner party!',
        ingredients: [
          { quantity: '175g/6oz', ingredient: 'digestive biscuits' },
          { quantity: '80g/3oz', ingredient: 'butter' },
          { quantity: '50g/2oz', ingredient: 'caster sugar' },
          { quantity: '3', ingredient: 'large free-range eggs, separated' },
          { quantity: '2', ingredient: 'limes, finely grated zest' },
          { quantity: '125ml/4½fl oz', ingredient: 'lime juice' },
          { quantity: '210ml/7½fl oz', ingredient: 'condensed milk' },
          { quantity: '80g/3oz', ingredient: 'caster sugar' },
          { quantity: '½ tsp', ingredient: 'vanilla extract' },
          { quantity: 'some', ingredient: 'pinch salt' },
          { quantity: '½ tsp', ingredient: 'cream of tartar' }
        ],
        methods: [
          'Preheat the oven to 180C/350F/Gas 4.',
          'For the pastry base, finely crush the biscuits by placing into a plastic bag and bashing with a rolling pin (alternatively, pulse to crumbs using a food processor). Transfer to a mixing bowl.',
          'Melt the butter in a saucepan, then pour over the biscuit crumbs. Add the sugar, then mix well to combine. Evenly spread the biscuit mixture in a 23cm/9in pie case, making sure to cover the sides of the tin as well. Level off any excess biscuit mixture.',
          'For the filling, whisk the egg yolks in a bowl until pale and fluffy. In a separate bowl, whisk together the lime zest, lime juice and condensed milk until smooth and creamy, then mix into the egg yolk mixture. Pour the mixture into the pie case.',
          'In a clean bowl, whisk the egg whites until soft peaks form when the whisk is removed from the bowl. Gradually fold in the sugar, vanilla extract, salt and cream of tartar, then whisk again until stiff peaks form. Spoon the meringue mixture over the filling in the pie case, using a fork to form the meringue into peaks.',
          'Bake the pie in the oven for 15-20 minutes, or until the meringue is golden-brown. Remove from the oven and allow to cool. Place into the fridge to chill completely before serving.',
          'To serve, cut slices of the key lime pie and serve with a scattering of blueberries and a few spoonfuls of whipped cream.',
        ]
      },
      {
        name: 'Pumpkin pie',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/pumpkinpie_70659_16x9.jpg'],
        category: 'American Pie',
        createdBy: 'foodee',
        tags: ['American Pie'],
        servings: 8,
        time: 90,
        description: "How to make homemade pumpkin pie in eight simple steps - no need to be spooked!",
        ingredients: [
          { quantity: '40g/1½oz', ingredient: 'crushed pecans mixed in)' },
          { quantity: '450g/1lb', ingredient: 'prepared weight pumpkin flesh' },
          { quantity: '2', ingredient: 'large eggs plus 1 yolk' },
          { quantity: '75g/3oz', ingredient: 'soft dark brown sugar' },
          { quantity: '1 tsp', ingredient: 'ground cinnamon' },
          { quantity: '½', ingredient: 'level teaspoon freshly grated nutmeg' },
          { quantity: '½ tsp', ingredient: 'ground allspice' },
          { quantity: '½ tsp', ingredient: 'ground cloves' },
          { quantity: '½ tsp', ingredient: 'ground ginger' },
          { quantity: '275ml/10fl oz', ingredient: 'double cream' },
        ],
        methods: [
          'Pre-heat the oven to 200C/400F/Gas 6.',
          'If using a shop bought sweet crust pastry case, use one that is 23cm/9in diameter and 4cm/1½in deep. If using your own pastry, roll it out and use it to line a 23cm/9in pie plate (not loose bottomed). Bake the pastry case blind for 20 minutes.',
          'To make the filling, place the pumpkin chunks on a baking tray, cover with foil and roast until tender. This will take about 20-30 minutes, depending on your pumpkin. Press the cooked pumpkin in a coarse sieve and to extract any excess water. Set aside to cool before blending in a food processor, or mashing by hand to a pureé.',
          'Lightly whisk the eggs and extra yolk together in a large bowl.',
          'Place the sugar, spices and the cream in a pan, bring to simmering point, giving it a whisk to mix everything together. Then pour it over the eggs and whisk it again briefly. Now add the pumpkin pureé, still whisking to combine everything thoroughly.',
          'Reduce the oven temperature to 180C/350F/Gas 4. Pour the filling into your pastry case and bake for 35-40 minutes, by which time it will puff up round the edges but still feel slightly wobbly in the centre.',
          'Remove the pie from the oven and place the tin on a wire cooling rack. Serve warm or chilled (stored loosely covered in foil in the fridge) with some chilled créme fraïche or whipped cream.',
        ]
      },
      {
        name: 'Chicken and bacon ranch burger',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/chicken_ranch_burger_40749_16x9.jpg'],
        category: 'Burger',
        createdBy: 'foodee',
        tags: ['Burger'],
        servings: 4,
        time: 90,
        description: 'Fresh herbs and hot sauce give the ranch dressing for this lighter burger extra punch.',
        ingredients: [
          { quantity: '4', ingredient: 'skinless, boneless chicken breasts' },
          { quantity: '2', ingredient: 'garlic cloves, grated' },
          { quantity: '2 tbsp', ingredient: 'olive oil' },
          { quantity: '8', ingredient: 'rashers smoked streaky bacon' },
          { quantity: '4', ingredient: 'large wholemeal burger buns' },
          { quantity: '2', ingredient: 'Little Gem lettuces' },
          { quantity: '2', ingredient: 'large tomatoes, sliced' },
          { quantity: '1', ingredient: 'ripe avocado, quartered and sliced' },
          { quantity: 'some', ingredient: 'salt and freshly ground black pepper' },
          { quantity: '2 tbsp', ingredient: 'reduced-fat mayonnaise' },
          { quantity: '2 tbsp', ingredient: 'soured cream' },
          { quantity: '½', ingredient: 'garlic clove, finely grated' },
          { quantity: '2 tbsp', ingredient: 'finely chopped dill' },
          { quantity: '1 tbsp', ingredient: 'finely chopped chives' },
          { quantity: '3', ingredient: 'dashes Worcestershire sauce' },
          { quantity: 'some', ingredient: 'pinch cayenne pepper' },
          { quantity: '2', ingredient: 'dashes Sriracha hot sauce' },
          { quantity: '½ tsp', ingredient: ' white wine vinegar' },
          { quantity: '1 tsp', ingredient: 'mild American mustard' },
        ],
        methods: [
          'Preheat the oven to 200C/180C Fan/Gas 6 and line a baking tray with baking paper.',
          'Put the chicken breasts on a board lined with clingfilm. Top with another layer of clingfilm and bash with a rolling pin to a 1cm/½in even thickness. Lay the chicken breasts in a shallow dish. Add the garlic, olive oil and some salt and pepper and rub well into the chicken. Set aside to marinate for 15 minutes.',
          'Meanwhile, lay the bacon rashers on a wire rack over the lined baking tray. Cook in the oven for 12–15 minutes, or until browned and crispy.',
          'For the ranch dressing, mix all the ingredients together and season with salt and pepper.',
          'Heat a large griddle pan over a high heat. Cut the burger buns in half and toast the cut sides on the griddle in batches, until lightly charred. Set aside.',
          'Lay the chicken breasts on the griddle and cook for 2–3 minutes on each side, or until cooked through.',
          'To assemble the burgers, spread 1 tablespoon of ranch dressing over the bottom of each burger bun. Add the lettuce, chicken, tomato, bacon and avocado. Spread some more ranch dressing on the top half of the burger bun. Place on top of the filling and serve.',
        ]
      },
      {
        name: 'Tandoori cod burger',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/tandoori_cod_burger_93602_16x9.jpg'],
        category: 'Burger',
        createdBy: 'foodee',
        tags: ['Burger'],
        servings: 2,
        time: 60,
        description: "Foodee's tandoori fish burger is flavoured with a masala mix and served with a zingy onion and cucumber salad, all sandwiched between slices of brioche.",
        ingredients: [
          { quantity: '4 tbsp', ingredient: 'olive oil' },
          { quantity: '1½ tbsp', ingredient: 'tandoori masala' },
          { quantity: '3 tbsp', ingredient: 'Greek yoghurt' },
          { quantity: '2 x 100g/3½oz', ingredient: 'pieces skinless cod fillet' },
          { quantity: '¼ ', ingredient: 'red onion' },
          { quantity: '5', ingredient: 'fresh mint leaves' },
          { quantity: '100g/3½oz', ingredient: 'pickled cucumber, drained' },
          { quantity: '4', ingredient: 'slices brioche' },
          { quantity: 'some', ingredient: 'salt and freshly ground black pepper' },
        ],
        methods: [
          'Put 2 tablespoons of the oil, the tandoori masala, 1 tablespoon of the yoghurt and a pinch of salt in a medium bowl and stir. Add the cod and coat well.',
          'Heat the remaining 2 tablespoons of oil in a small frying pan over a medium heat. Once it’s hot, turn the heat down slightly and add the cod. Cook gently for 2–3 minutes on each side, then take off the heat and set aside, covered with kitchen foil',
          'Put the red onion and mint in another bowl with the pickled cucumbers, mix and season with salt and pepper.',
          'Lightly toast the brioche slices and spread the remaining 2 tablespoons of yoghurt over two slices. Place a piece of cod on top of each and top with the onion, mint and pickle mixture. Close the sandwiches with the remaining toasted brioche slices. Enjoy!',
        ]
      },
      {
        name: 'Irish stew',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/irishbeefstew_73826_16x9.jpg'],
        category: 'Irish Food',
        createdBy: 'foodee',
        tags: ['Irish Food'],
        servings: 6,
        time: 120,
        description: "Hearty and wholesome, Rachel Allen's slow-cooked beef stew is the ultimate taste of Ireland.",
        ingredients: [
          { quantity: '1½kg/3lb 5oz', ingredient: 'stewing beef, cut into cubes' },
          { quantity: '175g/6oz', ingredient: 'streaky bacon' },
          { quantity: '3 tbsp', ingredient: 'olive oil' },
          { quantity: '12', ingredient: 'baby onions, peeled' },
          { quantity: '18', ingredient: 'button mushrooms, left whole' },
          { quantity: '3', ingredient: 'carrots' },
          { quantity: 'some', ingredient: 'salt and freshly ground black pepper' },
          { quantity: '1 tbsp', ingredient: 'chopped thyme' },
          { quantity: '2 tbsp', ingredient: 'chopped parsley' },
          { quantity: '10', ingredient: 'cloves of garlic' },
          { quantity: '425ml/15fl oz', ingredient: 'red wine' },
          { quantity: '425ml/15fl oz', ingredient: 'chicken or beef stock' },
          { quantity: '50g/2oz', ingredient: 'butter' },
          { quantity: '50g/1¾oz', ingredient: 'flour' },
          { quantity: 'some', ingredient: 'champ' },
        ],
        methods: [
          'Brown the beef and bacon in the olive oil in a hot casserole or heavy saucepan.',
          'Remove the meat and toss in the onions, mushrooms and carrots, one ingredient at a time, seasoning each time.',
          'Place these back in the casserole, along with the herbs and garlic.',
          'Cover with red wine and stock and simmer for one hour or until the meat and vegetables are cooked.',
          'To make the roux, in a separate pan melt the butter, add the flour and cook for two minutes.',
          'When the stew is cooked, remove the meat and vegetables.',
          'Bring the remaining liquid to the boil and add one tbsp of roux.',
          'Whisk the mixture until the roux is broken up and the juices have thickened, allowing to boil.',
          'Replace the meat and vegetables, and taste for seasoning.',
          'Sprinkle with chopped parsley and serve with champ.',
        ]
      },
      {
        name: 'Irish rarebit',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/irish_rarebit_65884_16x9.jpg'],
        category: 'Irish Food',
        createdBy: 'foodee',
        tags: ['Irish Food'],
        servings: 3,
        time: 10,
        description: 'Take cheese on toast up a level with this stout and mustard rarebit mix. Keeps in the fridge for up to five days.',
        ingredients: [
          { quantity: '150ml/5fl oz', ingredient: 'whole milk' },
          { quantity: '1½ tbsp', ingredient: 'plain flour' },
          { quantity: '400g/14oz', ingredient: 'Irish cheddar cheese, grated' },
          { quantity: '160g/6oz', ingredient: 'breadcrumbs' },
          { quantity: '1 tsp', ingredient: 'English mustard powder' },
          { quantity: '120ml/4fl oz', ingredient: 'stout' },
          { quantity: '2', ingredient: 'free-range eggs' },
          { quantity: '4', ingredient: 'spring onions' },
          { quantity: '6', ingredient: 'slices toasted soda bread' },

        ],
        methods: [
          'Warm the milk in a saucepan and whisk in the flour. Keep stirring and bring to the boil. Reduce the heat to a simmer. The milk should thicken slightly',
          'Add the cheese and stir over a low heat until it has melted. Add the breadcrumbs, mustard and stout. Continue stirring until the mixture comes together, it should leave the sides of the pan.',
          'Remove from the heat and tip into a bowl, leave to cool slightly. Once cooled add the egg yolks and beat vigorously with a wooden spoon until the egg is thoroughly mixed in. Add the chopped spring onions.',
          'Spread the rarebit on toasted soda bread and place under a hot grill until bubbling and golden-brown',
        ]
      },
      {
        name: 'Almond rice pudding and cherry compôte',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/almond_rice_pudding_and_42007_16x9.jpg'],
        category: 'Nordic Food',
        createdBy: 'foodee',
        tags: ['Nordic Food'],
        servings: 4,
        time: 60,
        description: 'This is a traditional Scandinavian recipe, often served as part of a Christmas feast – a whole almond is hidden in the pudding and whoever finds it, gets an extra present. Top with a cherry compôte to make it extra special.',
        ingredients: [
          { quantity: '1½ litres/2½', ingredient: 'pints whole milk' },
          { quantity: '300g/10½oz', ingredient: 'short grain or pudding rice' },
          { quantity: '15g/½oz', ingredient: 'butter' },
          { quantity: '3 tbsp', ingredient: 'caster sugar' },
          { quantity: '1', ingredient: 'vanilla pod, split' },
          { quantity: '100g/3½oz', ingredient: 'blanched almonds' },
          { quantity: '500g/1lb 2oz', ingredient: 'cherries' },
          { quantity: '100g/3½oz', ingredient: 'caster sugar' },
          { quantity: '1', ingredient: 'lemon' },
          { quantity: '2 tsp', ingredient: 'arrowroot' },
          { quantity: 'some', ingredient: 'kirsch, to taste (optional)' },
          { quantity: '100ml/3½fl oz', ingredient: 'double cream, whipped' },
        ],
        methods: [
          'Put the milk, rice, butter, caster sugar and vanilla pod into a large saucepan. Heat it very slowly, until almost at boiling point, then turn it down. Cook for around 30 minutes on a very low heat, stirring frequently to make sure it does not stick to the bottom.',
          'Meanwhile, make the cherry compôte. Put the cherries in a saucepan with the caster sugar, lemon juice and 300ml/10 fl oz water. Heat slowly, stirring constantly, until the sugar has dissolved, then simmer for around 10 minutes until the cherries are slightly softened. Mix the arrowroot with a little water and stir until smooth. Add to the cherries as they are simmering and stir until the sauce has slightly thickened. Add the kirsch, if using.',
          'Stir the almonds into the pudding. Serve the pudding with a dollop of whipped cream and a large spoonful of the cherry compôte.',

        ]
      },
      {
        name: 'Rye bread',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/scandinavian_rye_bread_93361_16x9.jpg'],
        category: 'Nordic Food',
        createdBy: 'foodee',
        tags: ['Nordic Food'],
        servings: 1,
        time: 60,
        description: 'Norwegians love their bread and loaves made with rye flour are particularly popular.',
        ingredients: [
          { quantity: '175ml', ingredient: 'full-fat milk' },
          { quantity: '175ml', ingredient: 'water' },
          { quantity: '2 tbsp', ingredient: 'dark soft brown sugar' },
          { quantity: '1 x 7g', ingredient: 'sachet of fast-action dried yeast' },
          { quantity: '250g', ingredient: 'rye flour' },
          { quantity: '200g', ingredient: 'strong white flour' },
          { quantity: '1 tbsp', ingredient: 'fine sea salt' },
          { quantity: '2 tsp', ingredient: 'caraway seeds' },
          { quantity: 'some', ingredient: 'sunflower oil, for greasing' },
        ],
        methods: [
          'Put the milk, water and sugar in a small saucepan and heat very gently, stirring constantly, for just a few seconds until the liquid is lukewarm and the sugar has dissolved. Remove the pan from the heat and pour the mixture into a bowl.',
          'Stir in the yeast and leave for 10 minutes until there is a light froth floating on the surface.',
          'Put all the flour, rye and white, in a large bowl, stir in the salt and caraway seeds, then make a well in the centre. Pour the warm yeast mixture on to the flour and mix with a wooden spoon and then your hands to form a soft, spongy dough.',
          'Turn the dough out on to a well-floured surface and knead for 10 minutes or until it is smooth and elastic. Kneading this dough can be hard work so you’ll need to roll up your sleeves and give it some welly.',
          'Put the dough in a large, lightly oiled bowl and cover loosely with oiled cling film. Leave to rise in a warm place for about 1½ hours or until it has doubled in size.',
          'Put the dough on a floured work surface and knock it back with your knuckles, then knead for another minute.',
          'Shape the dough into a fat oval or round loaf, pulling the dough from the top and sides and tucking it underneath to make a neat shape.',
          'Place the loaf on a baking tray lined with baking parchment and score the surface 4 times with a sharp knife. Cover it loosely with the oiled cling film and leave to prove for a further 40–50 minutes until it has doubled in size once more.',
          'Preheat the oven to 180C/350F/Gas 4. Bake the loaf in the centre of the oven for 40 minutes or until it is well risen and the base sounds hollow when tapped sharply. Cool for at least 20 minutes before serving.',
        ]
      },
      {
        name: 'Cod gratin',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/simple_cod_gratin_with_90850_16x9.jpg'],
        category: 'Nordic Food',
        createdBy: 'foodee',
        tags: ['Nordic Food'],
        servings: 4,
        time: 60,
        description: 'You can use any white fish in this gratin recipe, and you can flex your chef muscles over the béarnaise sauce.',
        ingredients: [
          { quantity: '2', ingredient: 'leeks, sliced' },
          { quantity: '2', ingredient: 'carrot' },
          { quantity: '1', ingredient: 'onion' },
          { quantity: '40g/1½oz', ingredient: 'butter' },
          { quantity: '600g/1lb 5oz', ingredient: 'cod loin' },
          { quantity: '2 tbsp', ingredient: 'plain flour' },
          { quantity: '50ml/2fl oz', ingredient: 'dry white wine' },
          { quantity: 'some', ingredient: 'salt and freshly ground black pepper' },
          { quantity: '70ml/2½fl oz', ingredient: 'white wine vinegar' },
          { quantity: '2', ingredient: 'shallots, finely chopped' },
          { quantity: '2', ingredient: 'sprigs fresh tarragon' },
          { quantity: '1', ingredient: 'bay leaf' },
          { quantity: '6', ingredient: 'peppercorns' },
          { quantity: '4', ingredient: 'free-range egg yolks' },
          { quantity: '300g/10½oz', ingredient: 'unsalted butter' },
        ],
        methods: [
          'Gently fry the leeks, carrots and onion in the butter until softened and starting to caramelise. Add the cod and flour and stir over the heat for a minute or two. Stir in the wine and cook for another minute to allow the sauce to thicken a little. Season with salt and pepper',
          'For the béarnaise sauce, gently heat the vinegar in a saucepan. Add the shallots, tarragon sprigs, bay leaf and peppercorns. Heat gently over a medium heat until the volume of liquid has reduced by at least half. Strain and set aside until cooled.',
          'Meanwhile, preheat the oven to 180C/160C Fan/Gas 4 and butter a shallow ovenproof dish.',
          'Beat the egg yolks with a teaspoon of water. Stir the mixture into the strained, cooled vinegar and pour into a heatproof bowl set over a pan of simmering water. Whisk constantly until the sauce has increased in volume and is thick enough to coat the back of a spoon.',
          'Melt the unsalted butter in a saucepan. Remove the bowl from the heat and slowly pour in the melted butter in a steady stream, whisking continuously, until the mixture has thickened and is smooth. Fold in the chopped tarragon and season to taste with salt and pepper.',
          'Spoon the cod and vegetable mixture into the ovenproof dish. Pour over the béarnaise sauce and bake for 15-20 minutes.',
        ]
      },
      {
        name: 'Korean lamb shanks with swede and potato mash',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/slow_cooked_spiced_lamb_92752_16x9.jpg'],
        category: 'Korean Food',
        createdBy: 'foodee',
        tags: ['Korean Food'],
        servings: 2,
        time: 120,
        description: 'This familiar dish gets a Korean makeover that’s well worth the wait.',
        ingredients: [
          { quantity: '4 tbsp', ingredient: 'Gochujang (Korean chilli paste)' },
          { quantity: '5', ingredient: 'cloves garlic' },
          { quantity: '3 tbsp', ingredient: 'soy sauce' },
          { quantity: '4cm/1.5in', ingredient: 'piece fresh root ginger' },
          { quantity: '3 tbsp', ingredient: 'mirin' },
          { quantity: '1 tbsp', ingredient: 'honey' },
          { quantity: '1½ tbsp', ingredient: 'sesame oil' },
          { quantity: '½ tbsp', ingredient: 'ground black pepper' },
          { quantity: '2 tbsp', ingredient: 'olive oil' },
          { quantity: '2', ingredient: 'lamb shanks' },
          { quantity: '400ml/14fl oz', ingredient: 'chicken stock' },
          { quantity: 'some', ingredient: 'sea salt and freshly ground black pepper' },
          { quantity: '2', ingredient: 'spring onions' },
          { quantity: '50g/1¾oz', ingredient: 'toasted sesame seeds, to serve' },
          { quantity: '3', ingredient: 'potatoes' },
          { quantity: '1', ingredient: 'small swede' },
          { quantity: '4 tbsp', ingredient: 'butter' },
          { quantity: 'some', ingredient: 'splash milk' },

        ],
        methods: [
          'Preheat the oven to 160C/140C Fan/Gas 3. Put all the sauce ingredients into a food processor and blitz until smooth.',
          'To make the lamb shanks, heat the oil in a large heavy-based casserole dish with a tight-fitting lid over a medium heat. Add the lamb shanks and brown all over.',
          'Pour the sauce over the lamb and add the stock. Bring to the boil, then cover the pan tightly with foil and place the lid on top. Transfer to the oven and cook for 2½–3 hours, turning the shanks once or twice, until tender. Taste and adjust the seasoning, if necessary.',
          'Meanwhile, put the potatoes and swede in a large saucepan of salted water and bring to the boil. Cook for 15–20 minutes, or until tender, then drain and mash with the butter and milk. Season well.',
          'To serve, dollop some mash onto a large plate, sit a lamb shank on top and spoon over some of the sauce. Scatter over the spring onions and sesame seeds and serve.',
        ]
      },
      {
        name: 'Korean grilled beef short ribs (galbi gui)',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/korean_grilled_beef_72703_16x9.jpg'],
        category: 'Korean Food',
        createdBy: 'foodee',
        tags: ['Korean Food'],
        servings: 6,
        time: 30,
        description: 'For Koreans, galbi is the ultimate grilled beef dish. Serve it with salad leaves, rice, kimchi and pickled onions, using the leaves to make small parcels containing a little of everything.',
        ingredients: [
          { quantity: '800g/1lb 12oz', ingredient: '800g/1lb 12oz' },
          { quantity: '5 tbsp', ingredient: 'soy sauce' },
          { quantity: '2 tbsp', ingredient: 'roasted sesame oil' },
          { quantity: '3 tbsp', ingredient: 'runny honey' },
          { quantity: '2 tbsp', ingredient: 'mirin' },
          { quantity: '½ ', ingredient: 'Asian' },
          { quantity: '½', ingredient: 'onion' },
          { quantity: '6', ingredient: 'garlic cloves' },
          { quantity: '4cm/1½in', ingredient: 'piece fresh root ginger,' },
          { quantity: '½ tsp', ingredient: 'freshly ground black pepper' },
        ],
        methods: [
          'Put the ribs in a deep baking tray. Fill with enough water to submerge them, cover, then soak for 30–45 minutes, changing the water once or twice. Drain.',
          'Meanwhile, put all the remaining ingredients in a food processor and blend until smooth. Put the soaked ribs and marinade in a baking tray or wide, flat bowl. Using your hands, massage the sauce into the meat. Cover and refrigerate overnight.',
          'If cooking on the hob, put a heavy griddle pan over a medium-high heat. When hot, add the ribs to the pan in batches and cook for 6 minutes on each side.',
          'If barbecuing, place the grill 12–15cm/5–6in above the flame. Cook the ribs for 6 minutes on each side, turning every now and again to cook them evenly, until they are caramel-brown and slightly charred in places.',
          'Once cooked, use a pair of scissors to cut off the strip of bones and discard, then snip the meat into bite-size pieces. Serve immediately',
        ]
      }

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
     name: 'Chicken stock',
     banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/lightchickenstock_90221_16x9.jpg'],
     category: 'Chicken Food',
     createdBy: 'Nam',
     description: 'This homemade chicken stock recipe is a great way to make the most from your roast chicken.',
     tags: ['Chicken Food'] ,
     time: 120,
     servings: 4,
     ingredients: [
       {quantity: '1', ingredient: 'leek'},
       {quantity: '1', ingredient: 'carrot'},
       {quantity: '½', ingredient: 'arge onion'},
       {quantity: 'several', ingredient: 'sprigs fresh thyme'},
       {quantity: '1', ingredient: 'head garlic'},
       {quantity: '10 ', ingredient: 'black peppercorns'},
       {quantity: '1', ingredient: 'chicken carcass'},
       {quantity: '20', ingredient: 'chicken wings'},
        ],
        methods: [
          'Put all the ingredients into a stockpot or large heavy-bottomed pan.',
          'Pour in enough cold water to cover the chicken, bring to a simmer and cook, covered, for 1½–2 hours.',
          'After half an hour or so, remove any scum that rises to the surface with a ladle or a large spoon. Repeat as necessary.',
          'At the end of the cooking time, strain the stock, discarding the vegetables and chicken pieces, and allow to cool. You can use the stock as it is, store in the fridge for up to 3 days, or freeze for up to 3 months.',
        ]
      },
      {
        name: 'Thai roast chicken',
        banners: ['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/thai_roast_chicken_92130_16x9.jpg'],
        category: 'Chicken Food',
        createdBy: 'Nam',
        description: 'Lemongrass, ginger and chillies add a wonderfully intense flavour and fragrance to roast chicken in this stunningly simple recipe.',
        tags: ['Chicken Food'],
        time: 120,
        servings: 6,
        ingredients: [
          {quantity: '2', ingredient: 'sticks lemongrass'},
          {quantity: '50g/1¾oz', ingredient: 'ginger,'},
          {quantity: '3 ', ingredient: 'spring onions'},
          {quantity: '2', ingredient: 'medium red chillies'},
          {quantity: '2', ingredient: 'medium yellow chillies'},
          {quantity: '1', ingredient: 'medium green chilli'},
          {quantity: '1 tbsp', ingredient: 'ground turmeric'},
          {quantity: '200ml/7oz', ingredient: 'groundnut oil'},
          {quantity: '1', ingredient: 'whole chicken'},
        ],
        methods: [
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
  console.log(DB_URI);
  mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, ssl: false })
    .then(() => mongoose.connection.db.dropDatabase())
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

export const SEED_DB = async () => {
  await mongoose.connection.db.dropDatabase();
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
  }), (err, result) => (result));
}; 