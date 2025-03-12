"use strict";

(function ($) {
    $(document).ready(function () {
        $('a.ai-buddy-notice-feedback').on("click", function (event) {
            event.preventDefault();
            let choice = $(this).data('choice');

            $.ajax({
                type: 'POST',
                url: ai_buddy_localized_data.ai_buddy_feedback_notice.api_url,
                data: JSON.stringify({
                    choice: choice,
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', ai_buddy_localized_data.ai_buddy_feedback_notice.nonce);
                },
                success: function (response) {
                    $('.ai-buddy-notice').hide();
                }
            });
        });
    });
})(jQuery);
