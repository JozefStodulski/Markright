function newUri()
{
    var page = document.documentElement.innerHTML;
    console.out(page);
    return "data:application/base64," + page;
}
function pageName()
{
    console.out(window.location.pathname.split("/").pop());
    return window.location.pathname.split("/").pop();
}
$(() => {
    selectable($("h1, p"));
    function select()
    {
        if (editable)
        {
            var $node = $(document.activeElement);
            $("section, p").removeClass("activeIndentLines").addClass("indentLines");
            switch ($node.prop("tagName"))
            {
            case "P":
                $node.removeClass("indentLines").addClass("activeIndentLines");
                break;
            case "H1":
                $node.parent().find("section, p").addBack().removeClass("indentLines").addClass("activeIndentLines");
                break;
            }
        }
    }
    function selectable($elem)
    {
        $elem.focus(
            event => select()
        ).blur(
            event => select()
        );
    }
    var editable = false;
    $(document).keydown(
        event => {
            var key = event.keyCode || event.which;
            if (key == 8)
            {
                var selection = window.getSelection();
                if (selection.focusOffset == 0 && selection.toString().length == 0)
                {
                    event.preventDefault();
                }
                else
                {
                    return;
                }
            }
            else if ([9, 13, 27].includes(key))
            {
                event.preventDefault();
            }
            if (key == 27) // ESCAPE: Edit mode
            {
                editable = !editable;
                if (editable)
                {
                    $("section, p").addClass("indentLines");
                    $("h1, p").prop("contenteditable", true);
                }
                else
                {
                    $("section, p").removeClass("activeIndentLines");
                    $("section, p").removeClass("indentLines");
                    $("h1, p").prop("contenteditable", false).blur();
                }
            }
            else if (editable)
            {
                var $current = $(document.activeElement);
                switch (key)
                {
                case 8: // BACKSPACE: Promote, merge
                    switch ($current.prop("tagName"))
                    {
                    case "P":
                        switch ($current.prev().prop("tagName"))
                        {
                        case "P":
                            if ($current.is(":last-child"))
                            { // .. 'P' .
                                switch ($current.parent().prop("tagName"))
                                {
                                case "ARTICLE":
                                    $current.prev().append($current.text()).focus();
                                    var range = document.createRange();
                                    var sel = window.getSelection();
                                    range.setStart($current.prev()[0], 1);
                                    range.collapse(true);
                                    sel.removeAllRanges();
                                    sel.addRange(range);
                                    $current.remove();
                                    break;
                                case "SECTION":
                                    $current.parent().after($current);
                                    $current.focus();
                                    break;
                                }
                            }
                            else
                            { // P 'P' ..
                                var $sec = $("<section></section>");
                                $sec.addClass("indentLines");
                                switch ($current.parent().prop("tagName"))
                                {
                                case "ARTICLE":
                                    $current.before($sec);
                                    break;
                                case "SECTION":
                                    $current.parent().after($sec);
                                    break;
                                }
                                $current.nextAll().addBack().appendTo($sec);
                                var $h1 = $(("<h1>" + $current.text() + "</h1>"));
                                $h1.prop("contenteditable", true)
                                selectable($h1);
                                $current.after($h1);
                                $h1.focus();
                                $current.remove();
                            }
                            break;
                        case "H1":
                            // H1 'P'
                            $current.prev().replaceWith("<p>" + $current.prev().text() + "</p>");
                            $current.prev().prop("contenteditable", true);
                            selectable($current.prev());
                            $current.unwrap().focus();
                            break;
                        case "SECTION":
                            // SEC 'P'
                            switch ($current.parent().prop("tagName"))
                            {
                            case "ARTICLE":
                                var $p = $current.prev();
                                while ($p.prop("tagName") != "P")
                                {
                                    $p = $p.children().last();
                                }
                                $p.append($current.text());
                                var range = document.createRange();
                                var sel = window.getSelection();
                                range.setStart($p[0], 1);
                                range.collapse(true);
                                sel.removeAllRanges();
                                sel.addRange(range);
                                $current.remove();
                                break;
                            case "SECTION":
                                $current.parent().after($current.nextAll().addBack());
                                $current.focus();
                                break;
                            }
                            break;
                        case undefined: // . P
                            if ($current.siblings().length > 0)
                            {
                                var $sec = $("<section></section>");
                                $sec.addClass("indentLines");
                                $current.before($sec);
                                $current.nextAll().addBack().appendTo($sec);
                                var $h1 = $(("<h1>" + $current.text() + "</h1>"));
                                $h1.prop("contenteditable", true);
                                selectable($h1);
                                $current.after($h1);
                                $h1.focus();
                                $current.remove();
                            }
                            break;
                        }
                        break;
                    case "H1":
                        switch ($current.parent().prev().prop("tagName"))
                        {
                        case "P":
                            // P SEC>('H1' ..)
                            switch ($current.parent().parent().prop("tagName"))
                            {
                            case "ARTICLE":
                                $current.parent().prev().append($current.text()).focus();
                                var range = document.createRange();
                                var sel = window.getSelection();
                                range.setStart($current.parent().prev()[0], 1);
                                range.collapse(true);
                                sel.removeAllRanges();
                                sel.addRange(range);
                                $current.unwrap().remove();
                                break;
                            case "SECTION":
                                $current.parent().parent().after($current.parent().nextAll().addBack());
                                $current.focus();
                                break;
                            }
                            break;
                        case "H1":
                            // H1 SEC>('H1' ..)
                            $current.parent().prev().replaceWith("<p>" + $current.parent().prev().text() + "</p>");
                            $current.parent().prev().prop("contenteditable", true);
                            selectable($current.parent().prev());
                            $current.parent().unwrap();
                            $current.focus();
                            break;
                        case "SECTION":
                            // SEC SEC>('H1' ..)
                            switch ($current.parent().parent().prop("tagName"))
                            {
                            case "ARTICLE":
                                var $p = $current.parent().prev();
                                while ($p.prop("tagName") != "P")
                                {
                                    $p = $p.children().last();
                                }
                                $p.append($current.text());
                                var range = document.createRange();
                                var sel = window.getSelection();
                                range.setStart($p[0], 1);
                                range.collapse(true);
                                sel.removeAllRanges();
                                sel.addRange(range);
                                $current.parent().after($current.nextAll());
                                $current.parent().remove();
                            case "SECTION":
                                $current.parent().parent().after($current.parent().nextAll().addBack());
                                $current.focus();
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                case 9: // TAB: Demote
                    switch ($current.prop("tagName"))
                    {
                    case "P":
                        var $prev = $current.prev();
                        switch ($prev.prop("tagName"))
                        {
                        case "P":
                            // ..P 'P' 
                            var $sec = $("<section></section>");
                            $sec.addClass("indentLines");
                            $prev.after($sec);
                            $prev.detach().appendTo($sec);
                            $current.detach().appendTo($sec);
                            $prev.replaceWith("<h1>" + $prev.text() + "</h1>");
                            $current.prev().prop("contenteditable", true);
                            selectable($current.prev());
                            break;
                        case "SECTION":
                            // ..SEC 'P' 
                            $current.detach().appendTo($prev);
                            break;
                        }
                        break;
                    case "H1":
                        var $parPrev = $current.parent().prev();
                        switch ($parPrev.prop("tagName"))
                        {
                        case "P":
                            // P SEC>'H1'
                            var $sec = $("<section></section>");
                            $sec.addClass("indentLines");
                            $parPrev.after($sec);
                            $parPrev.appendTo($sec);
                            $current.parent().appendTo($sec);
                            $parPrev.replaceWith("<h1>" + $parPrev.text() + "</h1>")
                            $current.parent().prev().prop("contenteditable", true);
                            selectable($current.parent().prev());
                            break;
                        case "SECTION":
                            // SEC SEC>'H1'
                            $current.parent().detach().appendTo($parPrev);
                            break;
                        }
                        break;
                    }
                    $current.focus();
                    break;
                case 13: // RETURN: Split
                    var caret = window.getSelection().anchorOffset;
                    var $p = $("<p></p>");
                    $p.prop("contenteditable", true).addClass("indentLines");
                    $p.append($current.text().substring(caret, $current.text().length));
                    $current.text($current.text().substring(0, caret));
                    $current.after($p);
                    selectable($p);
                    $p.focus();
                    break;
                }
            }
        }
    );
});

////////////////

// onSelect

// .wrap()

// .unwrap()

// .caret().start

// .prop("tagName")

// .parents().length

// .addBack()

// $('#target').replaceWith('<newTag>' + $('target').html() +'</newTag>')

////////////////
/*


BACKSPACE:

If this is p,
    If parent is article,
        If this is first child,
            Return;

        else, if prev is p,
            Append this text to prev, detach this;

        else, if prev is section,
            Make this h1, wrap this and nextAll in section;

    else, if parent is section,
        If prev is h1,
            Make prev p, unwrap; TODO;

        else, if prev is p,
            Detach this and nextAll, add after parent;

        else, if prev is section,
            TODO;
else, if this is h1,
    If parent’s parent is article,
        If parent is first child,
            Return;

        else, if parent's prev is p,
            Append this text to parent’s prev, unwrap this, remove;

        else, if parent's prev is section,
            Make this p, unwrap; TODO;

    else, if parent’s parent is section,
        If parent's prev is h1,
            Make parent's prev p, unwrap parent;

        else, if parent’s prev is p or section,
            Detach parent, add parent after parent’s parent;



TAB:

If this and prev are p,
    make prev h1 and wrap this and prev in new section;

If this is p and prev is section,
    append this to prev;

If this is h1 and parent’s prev is p,
    make that p h1, this h1 p, and prepend to this parent;

If this is h1 and parent’s prev is section,
    append parent to parent’s prev;

*/