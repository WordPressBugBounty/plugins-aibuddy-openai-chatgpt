"use strict";

(function ($) {
    $(document).ready(function () {
        let request = null;

        $("#ai_buddy-metadata").addClass('postbox').removeClass('closed');

        $(".button-abort-generate").on("click", function(event) {
            event.preventDefault();
            if (request !== null) {
                request.abort();
                request = null;
            }
            $(".ai-buddy-modal-window").removeClass('active');
        });

        function generatePostContent(api_url, nonce, post_type, post_id) {
            if (request !== null) {
                request.abort();
                request = null;
            }

            $('#postbox-container-1').css({
                'position': 'relative',
                'z-index': '9999',
            });
            $('.post-image-generate-done').hide();
            $('.post-image-generate').hide();
            $('.generated-post-headers').html('<div class="preloader"><div class="circle"></div><div class="circle"></div><div class="circle"></div></div>');
            $('.post-generate-popup').addClass('active popup-for-' + post_type).removeClass(`popup-for-${post_type === 'titles' ? 'excerpts' : 'titles'}`);
            $('.post-generate-popup').removeClass('popup-for-images');
            $(".ai-buddy-modal-window").removeClass('server-error');
            request = $.ajax({
                method: "POST",
                url: api_url,
                data: JSON.stringify({
                    "post_id": post_id
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', nonce );
                },
                success: function(response) {
                    let list = $('<ul></ul>');
                    for (let i = 0; i < response[post_type].length; i++) {
                        if (response[post_type][i].trim()) {
                            let item = $('<li></li>').text(response[post_type][i].replace(/^"(.+(?="$))"$/, '$1'));
                            item.on('click', function() {
                                $(this).addClass('active').siblings().removeClass('active');
                                $(`.post-${post_type}-generate`).prop('disabled', false);
                            });
                            list.append(item);
                        }
                    }
                    $('.generated-post-headers').html(list);
                    $(`.post-${post_type}-generate`).on('click', function(event) {
                        event.preventDefault();
                        $(".ai-buddy-modal-window").removeClass(`active popup-for-${post_type}`);
                        let selected = $('.generated-post-headers .active');
                        if (selected.length) {
                            if (post_type === 'titles') {
                                $('.wp-block-post-title:visible').focus().addClass('is-focus-mode').text(selected.text().trim());
                                $('.interface-complementary-area-header__small-title:visible').text(selected.text().trim());
                                $('#title:visible').val(selected.text().trim());
                                if($('#title-prompt-text')) {
                                    $('#title-prompt-text').hide();
                                }
                            } else {
                                if (typeof wp !== 'undefined' && typeof wp.data !== 'undefined' && typeof wp.data.select === 'function') {
                                    var excerpt = selected.text().trim();
                                    var currentPost = wp.data.select('core/editor').getCurrentPost();
                                    var updatedPost = wp.data.dispatch('core/editor').editPost({
                                        excerpt: excerpt
                                    });
                                    $('.editor-post-excerpt textarea:visible').val(excerpt);
                                }
                                $('#postexcerpt textarea').val(selected.text().trim());
                                $('#postexcerpt textarea').text(selected.text().trim());
                            }
                        }
                    });
                },
                error: function(xhr, status, error) {
                    $(".ai-buddy-modal-window").addClass('server-error');
                }
            });
        }

        function generatePost(type, api_url, nonce, post_id) {
            $('.generated-post-headers').empty();
            var post_type = '';
            if ($('body').hasClass('block-editor-page')) {
                var post_type = wp.data.select('core/editor').getCurrentPostType();
            } else {
                var post_type = $('#post_type').val();
            }
            var url = '/wp-json/wp/v2/' + post_type + 's/' + post_id;
            $.ajax({
                url: url,
                method: 'GET',
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader('X-WP-Nonce', nonce);
                },
                success: function(data) {
                    var post_content = data.content.rendered;
                    if (typeof post_content !== 'undefined' && post_content.trim().length > 0) {
                        $('.post-generate-popup').removeClass('no-content-for-request');
                        generatePostContent(api_url, nonce, type, post_id);
                    } else {
                        var popup_class = '';
                        switch(type) {
                            case 'titles':
                                popup_class = 'popup-for-titles';
                                break;
                            case 'excerpts':
                                popup_class = 'popup-for-excerpts';
                                break;
                            default:
                                break;
                        }
                        $('.post-generate-popup').addClass('active ' + popup_class + ' no-content-for-request').removeClass('popup-for-images');
                    }
                }
            });
        }

        function postGeneration(buttonClass, postType, removeClass) {
            $(buttonClass).on("click", function(event) {
                event.preventDefault();
                const post_id = $(this).data('post-id');
                $('.post-generate-popup').removeClass(removeClass);
                $('.generated-post-headers').removeAttr('style');

                if (typeof wp !== 'undefined' && wp.data && wp.data.select('core/editor')) {
                    let isSavingPost = wp.data.select('core/editor').isSavingPost;
                    let isAutosavingPost = wp.data.select('core/editor').isAutosavingPost;
                    let content = wp.data.select('core/editor').getEditedPostContent();

                    if (!content.trim()) {
                        generatePost(postType, ai_buddy_localized_data['ai_buddy_generate_' + postType].api_url, ai_buddy_localized_data['ai_buddy_generate_' + postType].nonce, post_id);
                    } else {
                        wp.data.dispatch('core/editor').savePost();
                        let unsubscribe = wp.data.subscribe(() => {
                            if (!isSavingPost() && !isAutosavingPost()) {
                                unsubscribe();
                                generatePost(postType, ai_buddy_localized_data['ai_buddy_generate_' + postType].api_url, ai_buddy_localized_data['ai_buddy_generate_' + postType].nonce, post_id);
                            }
                        });
                    }
                } else {
                    localStorage.setItem('shouldGeneratePost', 'true');
                    localStorage.setItem('postId', post_id);
                    localStorage.setItem('postType', postType);

                    if ($('#original_post_status').val() === 'publish') {
                        $('#publish').trigger('click');
                    } else {
                        $('#save-post').trigger('click');
                    }
                }
            });

                if (localStorage.getItem('shouldGeneratePost') === 'true') {
                    const postType = localStorage.getItem('postType');
                    const post_id = localStorage.getItem('postId');
                    localStorage.removeItem('shouldGeneratePost');
                    localStorage.removeItem('postId');

                    generatePost(postType, ai_buddy_localized_data['ai_buddy_generate_' + postType].api_url, ai_buddy_localized_data['ai_buddy_generate_' + postType].nonce, post_id);
                }
        }
        postGeneration('.button-post-title-generate', 'titles', 'popup-for-excerpts popup-for-images');

        postGeneration('.button-post-excerpt-generate', 'excerpts', 'popup-for-titles popup-for-images');
    });
})(jQuery);
