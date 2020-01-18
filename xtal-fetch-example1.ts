import {define} from 'trans-render/define.js';
import { XtalFetchEntities } from "./xtal-fetch-entities.js";
import {
  XtalFetchReqEventNameMap,
  XtalFetchEntitiesPropertiesIfc
} from "./types.d.js";
import { Test, ExpectedEvent } from "for-instance/types.d.js";

interface XtalFetchExpectedEvent<
  eventName extends keyof XtalFetchReqEventNameMap,
  assocPropName extends keyof XtalFetchEntitiesPropertiesIfc
> extends ExpectedEvent {
  name: eventName;
  detail?: XtalFetchReqEventNameMap[eventName];
  associatedPropName?: assocPropName;
}

interface XtalFetchTest<
  eventName extends keyof XtalFetchReqEventNameMap,
  assocPropName extends keyof XtalFetchEntitiesPropertiesIfc
> extends Test {
  trigger?: string;
  expectedEvent: XtalFetchExpectedEvent<eventName, assocPropName>;
}

/**
 * @element xtal-fetch
 */
export class XtalFetchExample1 extends XtalFetchEntities {
  fetch = true;
  href = "https://unpkg.com/xtal-fetch@0.0.75/demo/generated.json";
  
  
  resultChangedContract: XtalFetchTest<"result-changed", "result"> = {
    trigger: /* JS */`
    import 'https://unpkg.com/xtal-fetch/xtal-fetch-entities.js?module';
    `,
    expectedEvent: {
      name: "result-changed",
      detail: {
        value: [
          {
            _id: "580d3fbba86e6de6accf5cd1",
            index: 0,
            guid: "23bc285a-1c9e-4975-9c85-f3203721444e",
            isActive: false,
            balance: "$3,317.88",
            picture: "http://placehold.it/32x32",
            age: 37,
            eyeColor: "brown",
            name: "Cooper Patel",
            gender: "male",
            company: "UNISURE",
            email: "cooperpatel@unisure.com",
            phone: "+1 (821) 531-3163",
            address: "962 Varick Avenue, Bentley, Delaware, 1319",
            about:
              "Aliqua reprehenderit sit reprehenderit cillum anim duis reprehenderit ea deserunt veniam aliquip pariatur aute. Anim sint ea sunt ut sunt sint incididunt dolor. Ipsum ex dolor consequat aute. Eiusmod mollit qui nulla labore Lorem aute occaecat cillum irure fugiat. Nisi proident anim quis laboris veniam aute deserunt eu ipsum culpa eiusmod duis et pariatur.\r\n",
            registered: "2015-06-20T05:36:12 +04:00",
            latitude: -53.862758,
            longitude: -135.928028,
            tags: [
              "et",
              "deserunt",
              "proident",
              "proident",
              "qui",
              "magna",
              "voluptate"
            ],
            friends: [
              {
                id: 0,
                name: "Stuart Massey"
              },
              {
                id: 1,
                name: "Spencer Garrett"
              },
              {
                id: 2,
                name: "Petty Houston"
              }
            ],
            greeting: "Hello, Cooper Patel! You have 1 unread messages.",
            favoriteFruit: "strawberry"
          },
          {
            _id: "580d3fbb28cb6eedfb381e86",
            index: 1,
            guid: "ce10cf67-7499-466d-bffc-6e793e280f0a",
            isActive: false,
            balance: "$3,285.45",
            picture: "http://placehold.it/32x32",
            age: 40,
            eyeColor: "green",
            name: "Randolph Cameron",
            gender: "male",
            company: "AQUACINE",
            email: "randolphcameron@aquacine.com",
            phone: "+1 (980) 496-3651",
            address: "143 Jackson Court, Delshire, Vermont, 1273",
            about:
              "Cillum do laboris laborum aliquip labore nisi. Do dolore irure voluptate reprehenderit consequat. Laborum cupidatat cillum dolore officia elit.\r\n",
            registered: "2014-04-02T10:49:07 +04:00",
            latitude: 42.521681,
            longitude: -152.496821,
            tags: [
              "sint",
              "fugiat",
              "amet",
              "dolore",
              "non",
              "nostrud",
              "labore"
            ],
            friends: [
              {
                id: 0,
                name: "Leigh Rojas"
              },
              {
                id: 1,
                name: "Hale Scott"
              },
              {
                id: 2,
                name: "Head Jones"
              }
            ],
            greeting: "Hello, Randolph Cameron! You have 7 unread messages.",
            favoriteFruit: "banana"
          },
          {
            _id: "580d3fbb3e4f98e9c1ed509b",
            index: 2,
            guid: "c973f141-319c-441f-8cb7-b7a08114b3cc",
            isActive: true,
            balance: "$3,205.61",
            picture: "http://placehold.it/32x32",
            age: 40,
            eyeColor: "green",
            name: "Vivian Jacobson",
            gender: "female",
            company: "PARLEYNET",
            email: "vivianjacobson@parleynet.com",
            phone: "+1 (903) 441-2185",
            address: "556 Albemarle Terrace, Stagecoach, Idaho, 4267",
            about:
              "Ex anim pariatur eu mollit voluptate. Ad qui magna amet ullamco officia fugiat dolore elit cupidatat. Aute cupidatat nostrud consectetur est aute incididunt duis aliquip. Ex laboris incididunt nulla est culpa reprehenderit dolor tempor.\r\n",
            registered: "2015-02-22T10:51:13 +05:00",
            latitude: 28.14754,
            longitude: -84.275715,
            tags: [
              "nostrud",
              "in",
              "laborum",
              "ut",
              "reprehenderit",
              "deserunt",
              "pariatur"
            ],
            friends: [
              {
                id: 0,
                name: "Whitney Herman"
              },
              {
                id: 1,
                name: "Schultz Cooper"
              },
              {
                id: 2,
                name: "Delaney Nicholson"
              }
            ],
            greeting: "Hello, Vivian Jacobson! You have 6 unread messages.",
            favoriteFruit: "apple"
          }
        ]
      }
    }
  };
}
