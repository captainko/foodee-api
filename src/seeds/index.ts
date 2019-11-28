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
          createdBy:'Diana Cotech',
          category:'Cake',
          description:'Diana shows you how to bake a perfect sponge cake with a creamy passion fruit filling',
          servings:8,
          tags:['Cake'],
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
        createdBy:'Diana Cotech',
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
      name:'Mango smoothie',
      banners:['https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/mangosmoothie_86438_16x9.jpg'],
      category:'Smoothie',
      createdBy:'Diana Cotech',
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
    }
  ],
      saved: [{
      }]
    }
  },
  {
    username: faker.name.firstName() + faker.name.lastName(),
    admin: true,
    isVerified: true,
    collec_: [],
    email: faker.internet.email(),
    // avatar
    img: faker.image.avatar(),
    password: faker.internet.password(10),
    recipes: {
      created: [{
        name: faker.name.title(),
        category: faker.random.arrayElement(CATEGORIES),
        time: faker.random.number({ min: 10, max: 200 }),
        servings: faker.random.arrayElement(SERVINGS),
        methods: fakeMethods(),
        // recipe images
        banners: fakeImages(),
        description: faker.lorem.sentences(2),
        ingredients: [
          { quantity: '1/2 spoon', ingredient: 'sugar' },
          { quantity: '500g', ingredient: 'beef' },
        ]
      }],
      saved: [],
    }
  },
  // {
  //   username: 'Foodee',
  //   admin: true,
  //   isVerified: true,

  // }

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
      }
    
    
    ],
      saved: [],
    }
  }
  ,
  {
    username: 'Nam Em',
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
  mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true , ssl: true})
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
                .then(images => {
                  const recipe = new Recipe(r);
                  recipe.banners = images.map(x => x.id);
                  // @ts-ignore
                  recipe.createdBy = newUser.id;
                  newUser.createdRecipes.unshift(recipe.id);
                  newUser.save();
                  return recipe.save();
                })
                .then(newRecipe => rDone(null, newRecipe))
                .catch(err => rDone(err, null));

            });
            async.parallel(createRecipeFuncs, (err, recipes) => {
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