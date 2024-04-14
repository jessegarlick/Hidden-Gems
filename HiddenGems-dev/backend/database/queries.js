 import {User, Gem, Comment, Tag, db } from "./model.js"

// let tagId = 1

//  const gem = await Gem.findAll({
//     include: [{
//       model: Tag,
//       where: { id: tagId } // Filtering by tagId
//     }]
//   });


// // console.log(await Tag.findAll())

// // const tag1 = await Tag.findByPk(1)
// // const tag2 = await Tag.findByPk(2)
// // const tag3 = await Tag.findByPk(3)
// // const gem1 = await Gem.findOne()

// // await gem1.addTag(tag1)
// // await gem1.addTag(tag2)
// // await gem1.addTag(tag3)

// // console.log(await Gem.findOne({ include: Tag })) 

const tag2 = await Tag.findByPk(2, {
    include: Gem
})

const tag3 = await Tag.findByPk(2, {
    include: [{
        model: Gem,
        attributes: ['gemId'] // Only include the gemId attribute
    }]
});

const tag4 = await Tag.findByPk(2, {
    include: [{
        model: Gem,
        attributes: ['gemId'], // Only include the gemId attribute
        through: { attributes: [] } // Exclude the intermediate table (GemTag) attributes
    }]
});

console.log(tag2)
console.log(tag3)
console.log(tag4)
// console.log(await Gem.findAll({ include: Tag }))

// // console.log(tag2.gems)

// await db.close()
// =======
// import {User, db, Gem, Comment, Friendship } from "./model.js"

// // const userId = 2; 

// // User.findOne({
// //     where:{userId: userId},
// //   include: [{ model: Gem }, { model: Comment }]
// // })
// //   .then(user => {
// //     if (!user) {
// //       console.log('User not found');
// //       return;
// //     }
    
    
// //     console.log('User:', user.email);
// //     console.log('Gems:', user.gems); 
// //     console.log(user.gems.map((gem) => gem.name))
// //     console.log('Comments:', user.comments); 
// //   })
// //   .catch(error => {
// //     console.error('Error retrieving user:', error);
// //   });

//   const user1 = await User.findByPk(3);
//   const user2 = await User.findByPk(4);

//   await user1.addFriendship(user2);
//   await user2.addFriendship(user1);


  await db.close();



  
// >>>>>>> dev

