import { mockData, ClientPrisma } from './data';
import * as _ from 'lodash';
// constructor
// const hotel = new Prisma({
//     endpoint: 'http://localhost:4466/abcdef/devxyz',
//     secret: 'secreetttttt',
//   })  //custom endpoint

// Có thể hoàn toàn ko cần làm file seed.ts
// Call truyền đối số data vào hàm và gọi luôn
// Nhưng chủ yếu để biết chạy chạy seed mongodb graphql bằng cli (prisma seed)

const format = s =>
  s
    .toLowerCase()
    .split(/\s|%20/)
    .filter(Boolean)
    .join('-');
const setup = async (dataMock: any[]) => {
  const hotel = new ClientPrisma();
  dataMock.forEach(async i => {
    hotel
      .createHotel({
        agentId: '5f9e73af51915100072a4cbe',
        connectId: {
          connect: {
            email: 'duyminhpham1201@gmail.com',
          },
        },
        title: i.title,
        agentEmail: "phucpham1301@gmail.com",
        agentName: "Phuc Pham",
        slug: format(i.slug),
        content: i.content,
        price: parseInt(i.price),
        isNegotiable: i.isNegotiable,
        propertyType: i.propertyType,
        condition: i.condition,
        termsAndCondition: i.termsAndCondition,
        contactNumber: i.contactNumber,
        rating: i.rating,
        ratingCount: i.ratingCount,
        status: i.status,
        image: {
          create: _.omit(i.image, 'id'),
        },
        location: {
          create: _.omit(i.location, 'id'),
        },
        gallery: {
          create: i.gallery.map(v => ({
            url: v.url,
          })),
        },
        amenities: {
          create: {
            guestRoom: i.amenities[0].guestRoom,
            bedRoom: i.amenities[1].bedRoom,
            wifiAvailability: i.amenities[2].wifiAvailability,
            parkingAvailability: i.amenities[3].parkingAvailability,
            poolAvailability: i.amenities[4].poolAvailability,
            airCondition: i.amenities[5].airCondition,
            extraBedFacility: i.amenities[6].extraBedFacility,
          },
        },
        // categories: {
        //   create: i.categories,
        // },
      })
      .catch(e => console.log(e));
  });
};
setup(mockData);
// data:[{
//     connectId:"123id"
//     title: "abc"
//     name:"123abccc"
// },
// {
//     connectId:"vcvcc"
//     title: "xyz"
//     name:"223"
// }]
