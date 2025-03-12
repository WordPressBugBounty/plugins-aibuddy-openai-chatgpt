"use strict";

(function ($) {
    $(document).ready(function () {
        let request = null;

        $(".button-abort-product-generate").on("click", function(event) {
            event.preventDefault();
            if (request != null) {
                request.abort();
                request = null;
            }
            $(".button-product-generator").removeClass('loading');
            $(".ai-buddy-modal-window").removeClass('active');
        });
        $( '.button-product-popup' ).on( "click", function( event ) {
            event.preventDefault();

            let parent_element = $(this).closest('#post-body');
            let product_title = parent_element.find('#title').val();

            $('#product-new-content-generator').val(product_title);
            $('.product-generate-popup').addClass('active').removeClass('server-error');
            $('.button-product-generator').removeClass('loading');
            $('.section.product-image, .product-title-image').hide();
            $('.section.product-fields, .product-title-fields').show();
            $('#product-new-content-generator').on('input', function() {
                if ($(this).val().trim() !== '') {
                    $('.button-product-generator').prop('disabled', false);
                } else {
                    $('.button-product-generator').prop('disabled', true);
                }
            });
            if ($('#product-new-content-generator').val() !== '') {
                $('.button-product-generator').prop('disabled', false);
            }
        });
        $( '.button-product-generator' ).on( "click", function( event ) {
            event.preventDefault();
            generateProductContent();
        });

        function generateProductContent() {
            if (request !== null) {
                request.abort();
                request = null;
            }

            $( '.button-product-generator' ).addClass('loading');
            let post_title = $('#product-new-content-generator').val();
            let prompt = "Here is the product: "+ post_title +". Based on the product, write a description of this product (between 120 and 240 words), a short description (between 20-49 words), a SEO-friendly title (between 3-6 words), and tags (up to 5), separated by commas. Important! Use this format in a line : Description:Description Text, Excerpt: Excerpt Text, Title: Title Text, Tags: Tags";

            request = $.ajax({
                method: "POST",
                url: ai_buddy_localized_data.ai_buddy_content_builder.api_url,
                data: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "messages": [{
                        "role": "user",
                        "content": prompt,
                    }],
                    "temperature": 0.8,
                    "max_tokens": 512,
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function ( xhr ) {
                    xhr.setRequestHeader( 'X-WP-Nonce', ai_buddy_localized_data.ai_buddy_content_builder.nonce );
                },
                success: function(response) {
                    let completionLines = response.completions.split('\n');
                    $('.button-product-generate').prop('disabled', false);
                    $('.product-fields .ai-buddy-button').text($('.product-fields .ai-buddy-button').data("apply"));

                    let validData = true;
                    let completionValues = {};
                    for (let i = 0; i < completionLines.length; i++) {
                        let line = completionLines[i];
                        if (line.trim() === "") {
                            validData = false;
                            break;
                        }
                        let lineParts = line.split(':');
                        if (lineParts.length !== 2) {
                            validData = false;
                            break;
                        }
                        let key = lineParts[0].trim();
                        let value = lineParts[1].trim();
                        completionValues[key] = value;
                    }

                    if (!validData) {
                        generateProductContent();
                        return;
                    }

                    $( '.button-product-generator:visible' ).removeClass('loading');
                    $('#new-product-title').val(completionValues['Title']).prop('disabled', false);
                    $('.button-product-title').prop('disabled', false);
                    $('#new-product-description').val(completionValues['Description']).prop('disabled', false);
                    $('.button-product-description').prop('disabled', false);
                    $('#new-product-excerpt').val(completionValues['Excerpt']).prop('disabled', false);
                    $('.button-product-excerpt').prop('disabled', false);
                    $('#new-product-tags').val(completionValues['Tags']).prop('disabled', false);
                    $('.button-product-tags').prop('disabled', false);

                    function updateEditorContent(button, blockType = null, attributeKey = null, contentSelector = null) {
                        $(`.button-product-${button}`).on("click", function(event) {
                            event.preventDefault();
                            let newValue = $(`#new-product-${button}`).val();

                            if (typeof wp !== 'undefined' && wp.data && typeof wp.data.select === 'function' && wp.data.select('core/editor')) {
                                if (button === 'tags') {
                                    const productId = wp.data.select('core/editor').getCurrentPostId();
                                    const tagsArray = newValue.split(',').map(tag => tag.trim());
                                    fetch(ai_buddy_localized_data.ai_buddy_generate_tags.api_url, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'X-WP-Nonce': ai_buddy_localized_data.ai_buddy_generate_tags.nonce
                                        },
                                        body: JSON.stringify(tagsArray)
                                    })
                                        .then(response => response.json())
                                        .then(tagIds => {
                                            wp.data.dispatch('core').editEntityRecord('postType', 'product', productId, {
                                                product_tag: tagIds
                                            });
                                        });
                                } else {
                                    wp.data.dispatch('core/editor').editPost({
                                        [contentSelector]: newValue
                                    });
                                }
                                    $(`.editor-post-${contentSelector} textarea:visible`).val(newValue);
                            } else {
                                let editor = tinyMCE.get(contentSelector);
                                if (editor) {
                                    editor.setContent('');
                                    editor.setContent(newValue);
                                }
                                else if(button === 'tags') {
                                    $('#new-tag-product_tag').val(newValue);
                                }
                                else {
                                    $(`#${contentSelector}`).val(newValue);
                                }
                            }

                            $(this).text($(this).data("done"));
                        });
                    }
                    updateEditorContent('description',  'core/paragraph', 'content', 'content');
                    updateEditorContent('title',  null, null, 'title');
                    updateEditorContent('excerpt',  'core/paragraph', 'content', 'excerpt');
                    updateEditorContent('tags',  null, null, null);

                    $('.button-product-generate').on( "click", function(event) {
                        event.preventDefault();
                        $('.button-product-title, .button-product-description, .button-product-excerpt, .button-product-tags').trigger('click');
                        $(".ai-buddy-modal-window").removeClass('active');
                    });
                },
                error: function(xhr, status, error) {
                    $(".product-generate-popup").addClass('server-error');
                }
            });
        }
    });
})(jQuery);
