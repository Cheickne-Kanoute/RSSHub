const puppeteer = require('puppeteer');

module.exports = async (ctx) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
    });

    const page = await browser.newPage();
    await page.goto('https://www.goal.com/fr/news', {
        waitUntil: 'networkidle2',
    });

    const items = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[data-testid="news-card-link"]'))
            .slice(0, 10)
            .map(link => ({
                title: link.querySelector('h3')?.innerText || 'Sans titre',
                link: link.href.startsWith('http') ? link.href : 'https://www.goal.com' + link.getAttribute('href'),
            }));
    });

    await browser.close();

    ctx.state.data = {
        title: 'Goal.com - News',
        link: 'https://www.goal.com/fr/news',
        item: items.map(article => ({
            title: article.title,
            link: article.link,
        })),
    };
};
