export interface Headline {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  source: string;
}

export const HEADLINES: Headline[] = [
  {
    id: "412093",
    title: "Amazon is entering the healthcare industry in Argentina!",
    content:
      "Amazon's marketing spokesperson Wisdom O. said that the company is planning to enter the healthcare industry in Argentina. The company is planning to launch a new healthcare service in the country, which will be available to all residents. The service will be available to all residents, regardless of their income level. The company is planning to launch the service in the next few months.",
    date: "2024-10-25",
    author: "Takaya Yamazaki",
    source: "The Buenos Aires Post",
  },
  {
    id: "387473",
    title: "Google is launching a new AI research lab in Tokyo!",
    content:
      "Google's CEO Sundar Pichai announced that the company is launching a new AI research lab in Tokyo. The lab will be focused on developing new AI technologies for the company's products and services. The lab will be led by Google's Chief AI Scientist, Dr. Andrew Ng. The lab is expected to open in the next few months.",
    date: "2024-10-25",
    author: "Noyuri Nakamura",
    source: "The Tokyo Times",
  },
];

export const getHeadlines = () => {
  return HEADLINES;
};

// export interface TrackingInformation {
//   orderId: string;
//   progress: "Shipped" | "Out for Delivery" | "Delivered";
//   description: string;
// }

// export const TRACKING_INFORMATION = [
//   {
//     orderId: "412093",
//     progress: "Shipped",
//     description: "Last Updated Today 4:31 PM",
//   },
//   {
//     orderId: "281958",
//     progress: "Out for Delivery",
//     description: "ETA Today 5:45 PM",
//   },
//   {
//     orderId: "539182",
//     progress: "Delivered",
//     description: "Front Porch Today 3:16 PM",
//   },
//   {
//     orderId: "1234",
//     progress: "Delivered",
//     description: "Front Porch Today 3:16 PM",
//   },
// ];

// export const getTrackingInformation = ({ orderId }: { orderId: string }) => {
//   return TRACKING_INFORMATION.find((info) => info.orderId === orderId);
// };
