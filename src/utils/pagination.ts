export function renderPagination(
    container: HTMLElement,
    currentPage: number,
    totalPages: number,
    onSelect: (page: number) => void,
): void {
    if (totalPages <= 1) {
        container.replaceChildren();
        return;
    }

    const createButton = (label: string, page: number, options: { active?: boolean; disabled?: boolean; ariaLabel?: string } = {}) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `page-btn${options.active ? ' active' : ''}`;
        button.textContent = label;
        button.disabled = Boolean(options.disabled);
        if (options.active) button.setAttribute('aria-current', 'page');
        if (options.ariaLabel) button.setAttribute('aria-label', options.ariaLabel);
        button.addEventListener('click', () => onSelect(page));
        return button;
    };

    const buttons: HTMLButtonElement[] = [
        createButton('‹', currentPage - 1, { disabled: currentPage === 1, ariaLabel: '이전 페이지' }),
    ];

    for (let page = 1; page <= totalPages; page += 1) {
        buttons.push(createButton(String(page), page, { active: page === currentPage, ariaLabel: `${page}페이지` }));
    }

    buttons.push(createButton('›', currentPage + 1, {
        disabled: currentPage === totalPages,
        ariaLabel: '다음 페이지',
    }));
    container.replaceChildren(...buttons);
}
