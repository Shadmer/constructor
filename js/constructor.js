$(function () {

    function scrollToElem(elem, ms) {
        let time = ms || 200;
        $('html, body').animate({
            scrollTop: elem.offset().top
        }, time);
    }

    function rus_to_latin(str) {

        let ru = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
            'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i',
            'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
            'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh',
            'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya'
        }, n_str = [];

        str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');

        for (let i = 0; i < str.length; ++i) {
            n_str.push(
                ru[str[i]]
                || ru[str[i].toLowerCase()] == undefined && str[i]
                || ru[str[i].toLowerCase()].replace(/^(.)/, function (match) {
                    return match.toUpperCase()
                })
            );
        }

        return n_str.join('');
    }

    function getCategoryName(sectionName) {
        // Можно поставить дополнительную проверку: не "-", а " -",
        // чтобы была возможность оставлять тире в названии категории,
        // но пошло оно нах.
        for (let i = 0; i < sectionName.length; i++) {
            if (sectionName[i] === '-') {
                return sectionName.slice(0, i).trim();
            }
        }
        return sectionName;
    }

    function getKey(sectionName) {
        return rus_to_latin(
            sectionName.trim().replace(/ +/g, " ").replace(/ - /g, "-").replace(/ /g, "_").toLowerCase()
        );
    }

    function getCategories() {
        let categories = [];
        let sections = $('.constructor__section');
        let section;
        let sectionName;
        let sectionId;
        let categoryName;
        let categoryId;
        for (let i = 0; i < sections.length; i++) {
            section = $(sections[i]);
            sectionName = section.find('.constructor__title h2').text();
            categoryName = getCategoryName(sectionName);
            sectionId = getKey(
                rus_to_latin(sectionName)
            );
            categoryId = getKey(
                rus_to_latin(categoryName)
            );
            categories.push(
                {
                    category: categoryId,
                    categoryName: categoryName,
                    id: sectionId,
                    name: sectionName,
                    html: section.find('.constructor__block').clone(),


                }
            );
        }
        return categories;
    }

    function showBlocks(categoryId) {
        let time = 300;

        if (categoryId === 'all-blocks') {
            $('.constructor-menu__block').show(time);
            return;
        }

        $('.constructor-menu__block').hide(time);
        let block = '.constructor-menu__block[data-category-id="' + categoryId +  '"]';

        $(block).show(time);
    }

    function addBlock(options) {
        let elem;
        let menu;

        for (let block of categories) {
            if (block.id === options.id) {
                elem = block.html.clone();
                menu = $(
                    '<div class="constructor__menu">\n' +
                    '    <a class="constructor__menu-del" href="#" title="Удалить">Удалить</a>\n' +
                    '    <a class="constructor__menu-copy" href="#" title="Копировать">Копировать</a>\n' +
                    '    <a class="constructor__menu-up" href="#" title="Вверх">Вверх</a>\n' +
                    '    <a class="constructor__menu-down" href="#" title="Вниз">Вниз</a>\n' +
                    '</div>' +
                    '<div class="constructor__add  constructor__add--before"></div>\n' +
                    '<div class="constructor__add  constructor__add--after"></div>'
                );
                elem.append(menu);

                if (options.order) {
                    if (options.before) {
                        elem.insertBefore(options.order);
                    } else {
                        elem.insertAfter(options.order);
                    }

                } else {
                    elem.appendTo('.constructor__content');
                }

                break;
            }
        }

        scrollToElem(elem);
        blockOptions = {};
    }

    let categories = getCategories();
    // console.log(categories);

    let blockOptions = {};

    (function setOptions(categories) {
            let categoryNames = [];
            for (let category of categories) {
                let categoryName = {
                    id: category.category,
                    name: category.categoryName
                };

                let double = categoryNames.some(function (elem) {
                    return elem.id === category.category;
                });

                if (!double) {
                    categoryNames.push(categoryName);
                }
            }

            for (let name of categoryNames) {
                let linkHtml = $('<a></a>')
                    .addClass('constructor-menu__link')
                    .attr('id', name.id)
                    .append(name.name);
                $('.constructor-menu__category').append(linkHtml);
            }


            for (let block of categories) {
                let img = 'images/constructor/' + block.id + '.png';
                let html = $('<div class="constructor-menu__block"><h3></h3><img src="images/others/no-info.png" alt="img"></div>')
                    .attr('id', block.id)
                    .attr('data-category-id', block.category);
                html.find('img').attr('src', img);
                html.find('h3').text(block.name);
                $('.constructor-menu__blocks').append(html);
            }
        }
    )(categories);

    $('.constructor__scaffolding [contenteditable]').attr('contenteditable', false);

    $(this).on('keydown', '[contenteditable]', function (e) {
        if (e.keyCode === 13) {
            document.execCommand('insertHTML', false, '<br><br>');
            return false;
        }
    });

    $(this).on('paste', '[contenteditable]', function (e) {
        e.preventDefault();
        let pastedData = e.originalEvent.clipboardData.getData('text');
        document.execCommand('inserttext', false, pastedData);
    });

    $(this).on('blur', '[contenteditable]', function () {
        this.innerHTML === ''
            ? this.classList.add('constructor__outline')
            : this.classList.remove('constructor__outline');
    });

    $('.constructor-menu__toggle').on('click', function () {
        $('.constructor-menu__content').toggleClass('constructor-menu__content--active');
        $('.constructor-menu__overlay').toggleClass('constructor-menu__overlay--active');
        $('.constructor-menu__toggle').toggleClass('constructor-menu__toggle--active');
        blockOptions = {};
    });

    $('.constructor-menu__overlay').on('click', function () {
        $('.constructor-menu__content').removeClass('constructor-menu__content--active');
        $('.constructor-menu__overlay').removeClass('constructor-menu__overlay--active');
        $('.constructor-menu__toggle').removeClass('constructor-menu__toggle--active');
        blockOptions = {};
    });

    $('.constructor-menu__checkbox input').on('change', function (e) {
        if (this.checked) {
            $('.constructor__scaffolding').hide(500);
            $('.constructor__content').show(500);
            $('.constructor-menu__category').show(500);
            $('.constructor-menu__blocks').show(500);
        } else {
            $('.constructor__scaffolding').show(500);
            $('.constructor__content').hide(500);
            $('.constructor-menu__category').hide(500);
            $('.constructor-menu__blocks').hide(500);
        }

    });

    $(this).on('click', '.constructor-menu__link', function (e) {
        e.preventDefault();
        $('.constructor-menu__link')
            .removeClass('constructor-menu__link--active')
            .filter(this)
            .addClass('constructor-menu__link--active');

        showBlocks(
            $(this).attr('id')
        );
    });

    $(this).on('click', '.constructor-menu__block', function (e) {
        blockOptions.id = $(this).attr('id');
        addBlock(blockOptions);
        $('.constructor-menu__content').removeClass('constructor-menu__content--active');
        $('.constructor-menu__overlay').removeClass('constructor-menu__overlay--active');
        $('.constructor-menu__toggle').toggleClass('constructor-menu__toggle--active');
        //Контрольный в голову
        blockOptions = {};
    });

    $(this).on('click', '.constructor__menu a', function (e) {
        e.preventDefault();
        let block = $(this).parents('.constructor__block');
        let html;
        switch ($(this).attr('class')) {
            case 'constructor__menu-del':
                block.remove();
                break;
            case 'constructor__menu-copy':
                html = block.clone();
                html.insertAfter(block);
                scrollToElem(html);
                break;
            case 'constructor__menu-up':
                block.insertBefore(block.prev());
                scrollToElem(block);
                break;
            case 'constructor__menu-down':
                block.insertAfter(block.next());
                scrollToElem(block);
                break;
            default:
                return false;
        }


    });

    $(this).on('click', '.constructor__add', function (e) {
        blockOptions.order = $(this).parents('.constructor__block');

        if ($(this).hasClass('constructor__add--before')) {
            blockOptions.before = true;
        }

        $('.constructor-menu__content').toggleClass('constructor-menu__content--active');
        $('.constructor-menu__overlay').toggleClass('constructor-menu__overlay--active');
    });

});