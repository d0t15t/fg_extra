(function($) {
  Drupal.behaviors.fgExtra = {
    attach: function (context, settings) {

      function fieldGroup(){
//        console.log('init fg object')
      }

      var fgSelectorVertical = 'field-group-tabs';
      var fgSelectorHorizontal = 'field-group-htabs';
      var fgObject = new fieldGroup();

      /**
       * fg extra init - run on horiz. & vert. Tabs
       */
      $('.'+fgSelectorVertical + ', .'+fgSelectorHorizontal)
        .on('initFGs', function(event, buttonsSelector, fsSelector) {

        fgObject.hash = window.location.hash;
        var items = [];
        var fg = $(this);
        // set css ID is undefined
        var fieldsets = fg.find(fsSelector);
        $.each(fieldsets, function(i) {
          var fset = $(this);
          var id = fset.attr('id');
          if (typeof id === 'undefined') {
            fset.attr('id', 'fieldset-'+(i+1));
          }
        });
        items.push(fg);

        fg_extra_setHorizontalTab(fg, buttonsSelector, fsSelector);
        fg_extra_syncHashFromFG(fg, $('form'), buttonsSelector, fsSelector);

        fgObject.items = items;
      });


      /**
       * Set active tab in a fieldgroup based on the URL #Fragment
       * if a fieldset contains the field referenced by the ID, make sure it is open
       */
      function fg_extra_setHorizontalTab(group, buttonsSelector, fsSelector) {
        if(window.location.hash) {
          var hash = window.location.hash;
          var targetSet = $(hash).length > 0
            ? $(hash) : $(hash).parents('fieldset');
//          var targetset = $(hash);
          var asdf;
          console.log('id is ' + $(hash).attr('id'));
          if (targetSet.length == 0) return false;
          var targetIndex = targetSet.index() - 1;
          var curButton = group.find(buttonsSelector+'.selected');
          var curIndex = curButton.index();
          var tabs = targetSet.siblings('fieldset').andSelf();
          var curSet = tabs[curIndex];
          var targetButton = group.find(buttonsSelector)[targetIndex];
          $(curSet).css({ 'display' : 'none' });
          targetSet.css({ 'display' : 'table-cell' });
          curButton.toggleClass('selected');
          $(targetButton).toggleClass('selected');
        }
      }

      /**
       * ensure that active fieldset tab is assigned as hash
       * ensure that hash persists on form submit
       */
      function fg_extra_syncHashFromFG(group, form, buttonsSelector, fsSelector) {
        var buttons = group.find(buttonsSelector);
        var tabs = group.find(fsSelector);
        var hash = window.location.hash;
        var formAction = form.attr('action');
        var asfd;
        form.attr('action', formAction + hash);
        buttons.each(function() {
          var button = $(this);
          button.find('a').click(function(e) {
            // prevent ajax from auto selecting the first tab
            // @hacky b/c i don't understand why the first tab is being set as active :-/
            if ( e.clientX && e.clientY ) {
              var index = button.index();
              var newActiveTab = tabs[index];
              var id = $(newActiveTab).attr('id');
              form.attr('action', formAction + '#' + id);
              window.location.hash = id;
              fgObject.hash = id;
              $(window).scrollTop(0);
              var asdf;
            }
          });
        });
      }

      function fg_extra_syncHashToError()  {
        var hash = window.location.hash;
        if (hash.length == 0) {
          var error = $('body').find('.error').last();
          if (error.length > 0) {
            var id;
            if (error.attr('id')) {
              id = error.attr('id');
            } else {
              id = Math.floor(Date.now() / 1000);
              error.attr('id', id);
            }
            window.location.hash = id;
          }
        }
      }


      $('body', context).once(function() {
        /*
         init fg extra vertical tabs functionality w/ specific selectors for
         vertical & horizontal tab variations
         */
//        $('.'+fgSelectorHorizontal).trigger('initFGs');
        $('.'+fgSelectorVertical).trigger('initFGs',
          ['.vertical-tab-button', '.vertical-tabs-panes > fieldset']);
        $('.'+fgSelectorHorizontal).trigger('initFGs',
          ['.horizontal-tab-button', '.horizontal-tabs-panes > fieldset']);


//        fg_extra_syncHashToError();

        /*
        prevent ajax from re-loading to first tab, see LINE 66
        * re-run fg-extra tab set
        ** @note - not sure if the reload is a 'default' ajax functionality or
        * an event from fieldgroups? or drupal forms?
         */
        $(document).ajaxComplete(function(e) {
          fg_extra_setHorizontalTab(fgObject.items[0]);
        });
      });

    }
  };
})(jQuery);
