import { Route } from '@/types';
import got from '@/utils/got';
import * as cheerio from 'cheerio';

export const route: Route = {
    path: '/news',
    name: 'Goal.com - Actualités',
    example: '/goal/news',
    maintainers: ['ton_github'],
    handler,
};

async function handler() {
    const url = 'https://www.goal.com/fr/news';
    const response = await got(url);
    const $ = cheerio.load(response.data);

    const items = $('a[data-testid="news-card-link"]')
        .slice(0, 10)
        .map((_, el) => {
            const link = $(el).attr('href');
            const title = $(el).find('h3').text().trim();
            return {
                title,
                link: link.startsWith('http') ? link : `https://www.goal.com${link}`,
            };
        })
        .get();

    return {
        title: 'Goal.com - Dernières actualités',
        link: url,
        description: 'Les dernières actualités de football sur Goal.com',
        item: items,
    };
}

