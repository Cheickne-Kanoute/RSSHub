import { Route } from '@/types';
import cache from '@/utils/cache';
import ofetch from '@/utils/ofetch';
import { load } from 'cheerio';

export const route: Route = {
    path: '/news',
    name: 'Goal News',
    example: '/goal/news',
    parameters: {},
    handler,
};

async function handler() {
    const url = 'https://www.goal.com/fr/news';
    const html = await ofetch(url);
    const $ = load(html);

    const items = $('.type-article')
        .slice(0, 10)
        .map((_, el) => {
            const a = $(el).find('a').first();
            const title = a.text().trim();
            const link = 'https://www.goal.com' + a.attr('href');
            return cache.tryGet(link, async () => ({
                title,
                link,
                description: title,
                pubDate: new Date().toUTCString(),
            }));
        })
        .get();

    return {
        title: 'Goal News',
        link: url,
        item: await Promise.all(items),
    };
}
