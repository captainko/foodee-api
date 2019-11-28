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

      }],
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