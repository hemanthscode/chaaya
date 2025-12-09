import { ApiError, sendSuccess } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getHomepageData, getAboutData, getRandomImages, getRelatedImages, generateSitemap } from '../services/portfolioService.js';

export const getHomepage = asyncHandler(async (req, res) => {
  const data = await getHomepageData();
  sendSuccess(res, data, 'Homepage data');
});

export const getAbout = asyncHandler(async (req, res) => {
  const data = await getAboutData();
  sendSuccess(res, data, 'About data');
});

export const getRandom = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 12;
  const images = await getRandomImages(limit);
  sendSuccess(res, { images }, 'Random images');
});

export const getRelated = asyncHandler(async (req, res) => {
  const images = await getRelatedImages(req.params.id);
  sendSuccess(res, { images }, 'Related images');
});

export const getSitemap = asyncHandler(async (req, res) => {
  const sitemap = await generateSitemap();
  res.set('Content-Type', 'application/xml');
  res.send(`
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemap.images.map(img => 
        `<url><loc>${img.cloudinaryUrl}</loc><lastmod>${img.updatedAt.toISOString()}</lastmod></url>`
      ).join('')}
      ${sitemap.series.map(series => 
        `<url><loc>${process.env.CLIENT_URL}/series/${series.slug}</loc><lastmod>${series.updatedAt.toISOString()}</lastmod></url>`
      ).join('')}
    </urlset>
  `);
});

export const getRobots = (req, res) => {
  res.type('text/plain').send(`
    User-agent: *
    Allow: /
    Sitemap: ${process.env.CLIENT_URL || 'http://localhost:5173'}/api/v1/sitemap
  `);
};

export default { getHomepage, getAbout, getRandom, getRelated, getSitemap, getRobots };
