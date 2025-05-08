import { Route } from '@/types';

export const route: Route = {
    path: '/goal/news',
    name: 'Goal.com',
    maintainers: ['TonNomGitHub'],
    handler,
    description: 'Actualités de goal.com',
};

async function handler(ctx) {
    const html = await ofetch('https://www.goal.com/fr/news');
    const $ = load(html);

    const items = $('.type-article')
        .map((_, el) => {
            const a = $(el).find('a').first();
            const title = a.text().trim();
            const link = a.attr('href');

            return {
                title,
                link: link.startsWith('http') ? link : 'https://www.goal.com' + link,
            };
        })
        .get();

    return {
        title: 'Goal.com - Actualités',
        link: 'https://www.goal.com/fr/news',
        item: items,
    };
}
