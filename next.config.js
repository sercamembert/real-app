/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "uploadthing.com",
      "utfs.io",
      "i1.sndcdn.com",
      "files.edgestore.dev",
    ],
  },
};
module.exports = nextConfig;
