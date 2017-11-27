$(() => {
    $(document).keydown(
        event => {
            var editable = false;
            var $focused = $(document.activeElement);
            var key = event.keyCode || event.which;
            switch (key)
            {
                case 8:
                    backspaced();
                    break;
                case 9:
                    tabbed();
                    break;
                case 13:
                    returned();
                    break;
                case 27:
                    escaped();
                    break;
            }
            function backspaced()
            {
                if (window.getSelection().anchorOffset == 0) // Caret at start of line
                {
                    event.preventDefault();
                    switch ($focused.prop("tagname")) // Focused element name
                    {
                        case "P":
                            backspacedP();
                            break;
                        case "H1":
                            backspacedH1();
                            break;
                    }
                }
            }
            function tabbed()
            {
                event.preventDefault();
                switch ($focused.prop("tagname")) // Focused element name
                {
                    case "P":
                        tabbedP();
                        break;
                    case "H1":
                        tabbedH1();
                        break;
                }
            }
            function returned()
            {
                event.preventDefault();
                let text = $focused.text();
                let caret = window.getSelection().anchorOffset;
                let length = text.length;
                let $p = newNode("p", text.substring(caret, length));
                $focused.text(text.substring(0, caret));
                $focused.after($p);
                $p.focus();
            }
            function escaped()
            {
                event.preventDefault();
                if (editable = !editable)
                {
                    $("section, p").addClass("indentLines");
                    $("h1, p").prop("contenteditable", editable);
                }
                else
                {
                    $("section, p").removeClass("indentLines");
                    $("h1, p").prop("contenteditable", editable).blur();
                }
            }
            function newNode(tag, text = "")
            {
                return $("<" + tag + ">" + text + "</" + tag + ">")
                    .prop("contenteditable", true)
                    .addClass("indentLines");
            }
            function backspacedP()
            {
                switch ($focused.prev().prop("tagName")) // Previous element
                {
                    case "P":
                        backspacedPAfterP();
                        break;
                    case "H1":
                        backspacedPAfterH1();
                        break;
                    case "SECTION":
                        backspacedPAfterSection();
                        break;
                }
            }
            function backspacedH1()
            {
                switch ($focused.parent().prev().prop("tagName")) // H1's parent's previous's name
                {
                    case "P":
                        backspacedH1InSectionAfterP();
                        break;
                    case "H1":
                        backspacedH1InSectionAfterH1();
                        break;
                    case "SECTION":
                        backspacedH1InSectionAfterSection();
                        break;
            }
            function tabbedP()
            {
                switch ($focused.prev().prop("tagName")) // Previous's name
                {
                    case "P":
                        tabbedPAfterP();
                        break;
                    case "SECTION":
                        tabbedPAfterSection();
                        break;
                }
            }
            function tabbedH1()
            {
                switch ($focused.parent().prev().prop("tagName")) // Parent's previous's name
                {
                case "P":
                    tabbedH1AfterP();
                    break;
                case "SECTION":
                    tabbedH1AfterSection();
                    break;
                }
            }
            function backspacedPAfterP()
            {
                if ($focused.is(":last-child")) // End of section/article
                {
                    backspacedLastPAfterP();
                }
                else
                {
                    backspacedAPAfterP();
                }
            }
            function backspacedPAfterSection()
            {
                switch ($current.parent().prop("tagName")) // Parent's name
                {
                    case "ARTICLE":
                        backspacedPAfterSectionInArticle();
                        break;
                    case "SECTION":
                        backspacedPAfterSectionInSection();
                        break;
            }
            function backspacedLastPAfterP()
            {
                switch ($Focused.parent().prop("tagName")) // Parent's name
                {
                    case "ARTICLE":
                        backspacedLastPAfterPInArticle();
                        break;
                    case "SECTION":
                        backspacedLastPAfterPInSection();
                        break;
            }
            function backspacedAPAfterP()
            {
                switch ($focused.parent().prop("tagName")) // Parent's name
                {
                    case "ARTICLE":
                        backspacedAPAfterPInArticle();
                        break;
                    case "SECTION":
                        backspacedAPAfterPInSection();
                        break;
            }
            function backspacedH1InSectionAfterP()
            {
                switch ($focused.parent().parent().prop("tagName")) // Parent's parent's name
                {
                    case "ARTICLE":
                        backspacedH1InSectionAfterPInArticle();
                        break;
                    case "SECTION":
                        backspacedH1InSectionAfterPInSection();
                        break;
                }

            }
            function backspacedH1InSectionAfterSection()
            {
                switch ($focused.parent().parent().prop("tagName")) // Parent's parent's name
                {
                    case "ARTICLE":
                        backspacedH1InSectionAfterSectionInArticle();
                        break;
                    case "SECTION":
                        backspacedH1InSectionAfterSectionInSection();
                        break;
                }
            }
            function backspacedPAfterH1()
            {
                // CODE
            }
            function tabbedPAfterP()
            {
                // CODE
            }
            function tabbedPAfterSection()
            {
                // CODE
            }
            function tabbedH1AfterP()
            {
                // CODE
            }
            function tabbedH1AfterSection()
            {
                // CODE
            }
            function backspacedPAfterSectionInArticle()
            {
                // CODE
            }
            function backspacedPAfterSectionInSection()
            {
                // CODE
            }
            function backspacedLastPAfterPInArticle()
            {
                // CODE
            }
            function backspacedLastPAfterPInSection()
            {
                // CODE
            }
            function backspacedAPAfterPInArticle()
            {
                // CODE
            }
            function backspacedAPAfterPInSection()
            {
                // CODE
            }
            function backspacedH1InSectionAfterH1()
            {
                // CODE
            }
            function backspacedH1InSectionAfterPInArticle()
            {
                // CODE
            }
            function backspacedH1InSectionAfterPInSection()
            {
                // CODE
            }
            function backspacedH1InSectionAfterSectionInArticle()
            {
                // CODE
            }
            function backspacedH1InSectionAfterSectionInSection()
            {
                // CODE
            }
        });
});