export default function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamify.slmnb.cn'; // 从环境变量读取
  
    return [
      {
        url: `${baseUrl}/zh`,
        lastModified: new Date(),
      },{
        url: `${baseUrl}/en`,
        lastModified: new Date(),
      },{
        url: `${baseUrl}/zh-TW`,
        lastModified: new Date(),
      },
    ];
  }