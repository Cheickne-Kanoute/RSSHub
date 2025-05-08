const ProcessFeed = ($) => {
    // Goal.com uses a simple structure where each news link has an article content
    let content = $('#main-content article');

    if (content.length === 0) {
        // In case of missing article content
        content = $('div.article-body');
    }

    if (content.length === 0) {
        // In case of other content structure
        content = $('main[role="main"]');
    }

    // Remove elements that don't belong in the news article
    content.find('header, footer, [data-testid="goal-logo-wrapper"]').remove();

    content.find('noscript').each((i, e) => {
        $(e).parent().html($(e).html());
    });

    content.find('img').each((i, e) => {
        if (!$(e).attr('src') && $(e).attr('srcSet')) {
            const srcs = $(e).attr('srcSet').split(', ');
            const lastSrc = srcs.at(-1);
            $(e).attr('src', lastSrc.split(' ')[0]);
        }
    });

    return content.html();
};

export default { ProcessFeed };
