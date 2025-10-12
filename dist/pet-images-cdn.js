// CDN Pet Images Pool
const PET_IMAGES_CDN = [
  // Unsplash高质量宠物图片
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1571988840298-3b5301d5109b?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1493406300581-484b8a40b8a1?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=face'
];

function getRandomPetImage() {
  return PET_IMAGES_CDN[Math.floor(Math.random() * PET_IMAGES_CDN.length)];
}

function getRandomPetImages(count = 1) {
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push(getRandomPetImage());
  }
  return images;
}

module.exports = {
  PET_IMAGES_CDN,
  getRandomPetImage,
  getRandomPetImages
};