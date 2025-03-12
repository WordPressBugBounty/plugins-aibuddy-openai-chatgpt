import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button, Flex, FlexItem, Spinner } from '@wordpress/components';
import { ReactComponent as AiBuddyLogo } from './../../assets/icons/aibuddy-logo.svg';
import { useEffect } from '@wordpress/element';
import { rawHandler } from '@wordpress/blocks';
import Select from 'react-select'
import { PanelBody, PanelRow } from '@wordpress/components';
import { TextareaControl } from '@wordpress/components';
import markdown from '@wcj/markdown-to-html';

/**
 * Function that handle the prompt change and add the post meta data to the prompt
 * @param userPrompt
 * @param title
 * @param categories
 * @param tags
 * @returns {string}
 */
function handlePromptChange(userPrompt, title, categories, tags, language, writingStyle, writingTone) {
    let resultPrompt = 'User entered this prompt use this prompt and create content with it:' + userPrompt + '.  Create content with proper headings, paragraphs, and bullet points, formatted in Markdown. Don\'t add any intro as AI like here is your content.., just give the content itself. You can reference this following details (but don\'t use them as headings) to create much better content. Content Language: '+ language +' . Writing Style: '+ writingStyle +'. Writing Tone: ' + writingTone + '.';

    if(title.length > 0) {
        resultPrompt = resultPrompt + 'The title of the post is: ' + title + '.';
    }

    if(categories.length > 0 && (categories.length === 1 && categories[0] !== 'Uncategorized') ) {
        let categoryString = categories.join(', ');
        resultPrompt = resultPrompt + 'The categories of the post are: ' + categoryString + '.';
    }

    if(tags.length > 0) {
        let tagString = tags.join(', ');
        resultPrompt = resultPrompt + 'The tags of the post are: ' + tagString + '.';
    }

    return resultPrompt;
}

/**
 * Function that collects the post meta data like category tags to use in the prompt
 * @returns {{categoryNames: *, title: ((function(Object, string): *)|*), tagNames: *}}
 */
function collectPostMeta() {
    const [categoryNames, setCategoryNames] = useState([]);
    const [tagNames, setTagNames] = useState([]);

    const title = wp.data.select('core/editor').getEditedPostAttribute('title');

    // Get the category IDs of the post
    const categoryIds = wp.data.select('core/editor').getEditedPostAttribute('categories');

    // Get the tag IDs of the post
    const tagIds = wp.data.select('core/editor').getEditedPostAttribute('tags');

    useEffect(() => {
        const fetchCategoryNames = async () => {
            const names = await Promise.all(categoryIds.map(id => wp.data.resolveSelect('core').getEntityRecord('taxonomy', 'category', id)));
            setCategoryNames(names.map(category => category ? category.name : null));
        };
        fetchCategoryNames();
    }, [categoryIds]);

    useEffect(() => {
        const fetchTagNames = async () => {
            const names = await Promise.all(tagIds.map(id => wp.data.resolveSelect('core').getEntityRecord('taxonomy', 'post_tag', id)));
            setTagNames(names.map(tag => tag ? tag.name : null));
        };
        fetchTagNames();
    }, [tagIds]);

    return { title, categoryNames, tagNames };
}

/**
 * Function that send prompt and get the response from the API
 * @param prompt
 * @param model
 * @returns {Promise<*>}
 */
async function getApiResponse(prompt, model) {
    const requestData = {
        messages: [{
            "role": "user",
            "content": prompt,
        }],
        model: model === null ? 'gpt-4o' : model,
        max_tokens: 2048,
        temperature: 0.6,
        source_page: 'post_page'
    };
    
    const response = await fetch(ai_buddy_localized_data.ai_buddy_content_builder.api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': ai_buddy_localized_data.ai_buddy_content_builder.nonce
        },
        body: JSON.stringify(requestData)
    });
    let responseData = await response.json();
    responseData = responseData.completions.trim();

    return responseData;
}

function convertMarkdownToHTML(string) {
    return markdown(string);
}

/**
 * Function that convert markdown content to Gutenberg blocks
 * @param content
 */
function createNewBlock(content) {
    wp.data.dispatch( 'core/editor' ).removeBlock( wp.data.select( 'core/editor' ).getSelectedBlockClientId() );

    // Convert HTML to Gutenberg blocks
    const blocks = rawHandler({ HTML: content });

    // Insert each block
    const { insertBlock } = wp.data.dispatch('core/editor');
    blocks.forEach(block => insertBlock(block));
}

/**
 * Function that returns the model list
 * 
 * @param options
 */
function getModelList(options) {
    let modelList = [
        {
            label: 'OpenAI',
            options: [
                {value: 'gpt-4o', label: __('GPT 4o', 'aibuddy-openai-chatgpt')},
                {value: 'gpt-4-turbo', label: __('GPT 4 Turbo', 'aibuddy-openai-chatgpt')},
                {value: 'gpt-4', label: __('GPT 4', 'aibuddy-openai-chatgpt')},
                {value: 'gpt-3.5-turbo-16k', label: __('GPT 3.5 Turbo 16k', 'aibuddy-openai-chatgpt')},
                {value: 'gpt-3.5-turbo', label: __('GPT 3.5 Turbo', 'aibuddy-openai-chatgpt')},
                {value: 'gpt-3.5-turbo-instruct', label: __('GPT 3.5 Turbo Instruct', 'aibuddy-openai-chatgpt')}
            ]
        }
    ];

    if(options && options.googleai && options.googleai.apikey) {
        modelList.push(
            {
                label: 'Google',
                options: [
                    { value: 'gemini-1.5-pro', label: __('Gemini 1.5 Pro', 'aibuddy-openai-chatgpt') },
                    { value: 'gemini-1.5-flash', label: __('Gemini 1.5 Flash', 'aibuddy-openai-chatgpt') },
                    { value: 'gemini-pro', label: __('Gemini 1.0 Pro', 'aibuddy-openai-chatgpt') }
                ]
            }
        )
    }

    if(options && options.claude && options.claude.apikey) {
        modelList.push(
            {
                label: 'Claude',
                options: [
                    { value: 'claude-3-opus-20240229', label: __('Claude 3 Opus', 'aibuddy-openai-chatgpt') },
                    { value: 'claude-3-sonnet-20240229', label: __('Claude 3 Sonnet', 'aibuddy-openai-chatgpt') },
                    { value: 'claude-3-haiku-20240307', label: __('Claude 3 Haiku', 'aibuddy-openai-chatgpt') }
                ]
            }
        )
    }

    if(options && options.openrouter && options.openrouter.apikey) {
        modelList.push(
            {
                label: 'Open Router',
                options: [
                    { value: 'anthropic/claude-1', label: __('Anthropic: Claude v1', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-1.2', label: __('Anthropic: Claude (older v1)', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-2', label: __('Anthropic: Claude v2', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-2.0', label: __('Anthropic: Claude v2.0', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-2.0:beta', label: __('Anthropic: Claude v2.0 (self-moderated)', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-2.1', label: __('Anthropic: Claude v2.1', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-2.1:beta', label: __('Anthropic: Claude v2.1 (self-moderated)', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-2:beta', label: __('Anthropic: Claude v2 (self-moderated)', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-3-haiku', label: __('Anthropic: Claude 3 Haiku', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-3-haiku:beta', label: __('Anthropic: Claude 3 Haiku (self-moderated)', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-3-opus', label: __('Anthropic: Claude 3 Opus', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-3-opus:beta', label: __('Anthropic: Claude 3 Opus (self-moderated)', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-3-sonnet', label: __('Anthropic: Claude 3 Sonnet', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-3-sonnet:beta', label: __('Anthropic: Claude 3 Sonnet (self-moderated)', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-instant-1', label: __('Anthropic: Claude Instant v1', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-instant-1:beta', label: __('Anthropic: Claude Instant v1 (self-moderated)', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-instant-1.0', label: __('Anthropic: Claude Instant (older v1)', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-instant-1.1', label: __('Anthropic: Claude Instant (older v1.1)', 'aibuddy-openai-chatgpt') },
                    { value: 'anthropic/claude-instant-1.2', label: __('Anthropic: Claude Instant v1.2', 'aibuddy-openai-chatgpt') },
                    { value: 'austism/chronos-hermes-13b', label: __('Chronos Hermes 13B v2', 'aibuddy-openai-chatgpt') },
                    { value: 'cognitivecomputations/dolphin-mixtral-8x7b', label: __('Dolphin 2.6 Mixtral 8x7B 🐬', 'aibuddy-openai-chatgpt') },
                    { value: 'cohere/command', label: __('Cohere: Command', 'aibuddy-openai-chatgpt') },
                    { value: 'cohere/command-r', label: __('Cohere: Command R', 'aibuddy-openai-chatgpt') },
                    { value: 'cohere/command-r-plus', label: __('Cohere: Command R+', 'aibuddy-openai-chatgpt') },
                    { value: 'databricks/dbrx-instruct', label: __('Databricks: DBRX 132B Instruct', 'aibuddy-openai-chatgpt') },
                    { value: 'databricks/dbrx-instruct:nitro', label: __('Databricks: DBRX 132B Instruct (nitro)', 'aibuddy-openai-chatgpt') },
                    { value: 'fireworks/mixtral-8x22b-instruct-preview', label: __('Fireworks: Mixtral-8x22B Instruct OH (preview)', 'aibuddy-openai-chatgpt') },
                    { value: 'google/gemini-pro', label: __('Google: Gemini Pro 1.0', 'aibuddy-openai-chatgpt') },
                    { value: 'google/gemini-pro-1.5', label: __('Google: Gemini Pro 1.5 (preview)', 'aibuddy-openai-chatgpt') },
                    { value: 'google/gemini-pro-vision', label: __('Google: Gemini Pro Vision 1.0', 'aibuddy-openai-chatgpt') },
                    { value: 'google/gemma-7b-it', label: __('Google: Gemma 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'google/gemma-7b-it:free', label: __('Google: Gemma 7B (free)', 'aibuddy-openai-chatgpt') },
                    { value: 'google/gemma-7b-it:nitro', label: __('Google: Gemma 7B (nitro)', 'aibuddy-openai-chatgpt') },
                    { value: 'google/palm-2-chat-bison', label: __('Google: PaLM 2 Chat', 'aibuddy-openai-chatgpt') },
                    { value: 'google/palm-2-chat-bison-32k', label: __('Google: PaLM 2 Chat 32k', 'aibuddy-openai-chatgpt') },
                    { value: 'google/palm-2-codechat-bison', label: __('Google: PaLM 2 Code Chat', 'aibuddy-openai-chatgpt') },
                    { value: 'google/palm-2-codechat-bison-32k', label: __('Google: PaLM 2 Code Chat 32k', 'aibuddy-openai-chatgpt') },
                    { value: 'gryphe/mythomax-l2-13b', label: __('MythoMax 13B', 'aibuddy-openai-chatgpt') },
                    { value: 'gryphe/mythomax-l2-13b:extended', label: __('MythoMax 13B (extended)', 'aibuddy-openai-chatgpt') },
                    { value: 'gryphe/mythomax-l2-13b:nitro', label: __('MythoMax 13B (nitro)', 'aibuddy-openai-chatgpt') },
                    { value: 'gryphe/mythomist-7b', label: __('MythoMist 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'gryphe/mythomist-7b:free', label: __('MythoMist 7B (free)', 'aibuddy-openai-chatgpt') },
                    { value: 'huggingfaceh4/zephyr-7b-beta', label: __('Hugging Face: Zephyr 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'huggingfaceh4/zephyr-7b-beta:free', label: __('Hugging Face: Zephyr 7B (free)', 'aibuddy-openai-chatgpt') },
                    { value: 'huggingfaceh4/zephyr-orpo-141b-a35b', label: __('Zephyr 141B-A35B', 'aibuddy-openai-chatgpt') },
                    { value: 'haotian-liu/llava-13b', label: __('Llava 13B', 'aibuddy-openai-chatgpt') },
                    { value: 'intel/neural-chat-7b', label: __('Neural Chat 7B v3.1', 'aibuddy-openai-chatgpt') },
                    { value: 'jebcarter/psyfighter-13b', label: __('Psyfighter 13B', 'aibuddy-openai-chatgpt') },
                    { value: 'jondurbin/airoboros-l2-70b', label: __('Airoboros 70B', 'aibuddy-openai-chatgpt') },
                    { value: 'jondurbin/bagel-34b', label: __('Bagel 34B v0.2', 'aibuddy-openai-chatgpt') },
                    { value: 'koboldai/psyfighter-13b-2', label: __('Psyfighter v2 13B', 'aibuddy-openai-chatgpt') },
                    { value: 'lizpreciatior/lzlv-70b-fp16-hf', label: __('lzlv 70B', 'aibuddy-openai-chatgpt') },
                    { value: 'mancer/weaver', label: __('Mancer: Weaver', 'aibuddy-openai-chatgpt') },
                    { value: 'meta-llama/codellama-34b-instruct', label: __('Meta: CodeLlama 34B Instruct', 'aibuddy-openai-chatgpt') },
                    { value: 'meta-llama/llama-2-13b-chat', label: __('Meta: Llama v2 13B Chat', 'aibuddy-openai-chatgpt') },
                    { value: 'meta-llama/llama-2-70b-chat', label: __('Meta: Llama v2 70B Chat', 'aibuddy-openai-chatgpt') },
                    { value: 'meta-llama/llama-2-70b-chat:nitro', label: __('Meta: Llama v2 70B Chat (nitro)', 'aibuddy-openai-chatgpt') },
                    { value: 'meta-llama/llama-3-8b-instruct:free', label: __('Meta: Llama 3 8B Instruct (free)', 'aibuddy-openai-chatgpt') },
                    { value: 'meta-llama/llama-3-8b-instruct:extended', label: __('Meta: Llama 3 8B Instruct (extended)', 'aibuddy-openai-chatgpt') },
                    { value: 'meta-llama/llama-3-70b', label: __('Meta: Llama 3 70B', 'aibuddy-openai-chatgpt') },
                    { value: 'meta-llama/llama-3-8b', label: __('Meta: Llama 3 8B', 'aibuddy-openai-chatgpt') },
                    { value: 'migtissera/synthia-70b', label: __('Synthia 70B', 'aibuddy-openai-chatgpt') },
                    { value: 'mistralai/mistral-7b-instruct', label: __('Mistral 7B Instruct', 'aibuddy-openai-chatgpt') },
                    { value: 'mistralai/mistral-7b-instruct:nitro', label: __('Mistral 7B Instruct (nitro)', 'aibuddy-openai-chatgpt') },
                    { value: 'mistralai/mistral-7b-openorca', label: __('Mistral OpenOrca 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'mistralai/mistral-large', label: __('Mistral Large', 'aibuddy-openai-chatgpt') },
                    { value: 'mistralai/mistral-medium', label: __('Mistral Medium', 'aibuddy-openai-chatgpt') },
                    { value: 'mistralai/mistral-small', label: __('Mistral Small', 'aibuddy-openai-chatgpt') },
                    { value: 'mistralai/mistral-tiny', label: __('Mistral Tiny', 'aibuddy-openai-chatgpt') },
                    { value: 'mistralai/mixtral-8x22b', label: __('Mistral: Mixtral 8x22B', 'aibuddy-openai-chatgpt') },
                    { value: 'mistralai/mixtral-8x7b', label: __('Mixtral 8x7B', 'aibuddy-openai-chatgpt') },
                    { value: 'mistralai/mixtral-8x7b-instruct', label: __('Mixtral 8x7B Instruct', 'aibuddy-openai-chatgpt') },
                    { value: 'mistralai/mixtral-8x7b-instruct:nitro', label: __('Mixtral 8x7B Instruct (nitro)', 'aibuddy-openai-chatgpt') },
                    { value: 'neversleep/noromaid-20b', label: __('Noromaid 20B', 'aibuddy-openai-chatgpt') },
                    { value: 'neversleep/noromaid-mixtral-8x7b-instruct', label: __('Noromaid Mixtral 8x7B Instruct', 'aibuddy-openai-chatgpt') },
                    { value: 'nousresearch/nous-capybara-34b', label: __('Nous: Capybara 34B', 'aibuddy-openai-chatgpt') },
                    { value: 'nousresearch/nous-capybara-7b', label: __('Nous: Capybara 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'nousresearch/nous-capybara-7b:free', label: __('Nous: Capybara 7B (free)', 'aibuddy-openai-chatgpt') },
                    { value: 'nousresearch/nous-hermes-2-mistral-7b-dpo', label: __('Nous: Hermes 2 Mistral 7B DPO', 'aibuddy-openai-chatgpt') },
                    { value: 'nousresearch/nous-hermes-2-vision-7b', label: __('Nous: Hermes 2 Vision 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'nousresearch/nous-hermes-llama2-13b', label: __('Nous: Hermes 13B', 'aibuddy-openai-chatgpt') },
                    { value: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo', label: __('Nous: Hermes 2 Mixtral 8x7B DPO', 'aibuddy-openai-chatgpt') },
                    { value: 'nousresearch/nous-hermes-2-mixtral-8x7b-sft', label: __('Nous: Hermes 2 Mixtral 8x7B SFT', 'aibuddy-openai-chatgpt') },
                    { value: 'nousresearch/nous-hermes-yi-34b', label: __('Nous: Hermes 2 Yi 34B', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-3.5-turbo', label: __('OpenAI: GPT-3.5 Turbo', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-3.5-turbo-0125', label: __('OpenAI: GPT-3.5 Turbo 16k', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-3.5-turbo-0301', label: __('OpenAI: GPT-3.5 Turbo (older v0301)', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-3.5-turbo-0613', label: __('OpenAI: GPT-3.5 Turbo (older v0613)', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-3.5-turbo-1106', label: __('OpenAI: GPT-3.5 Turbo 16k (older v1106)', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-3.5-turbo-16k', label: __('OpenAI: GPT-3.5 Turbo 16k', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-3.5-turbo-instruct', label: __('OpenAI: GPT-3.5 Turbo Instruct', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-4', label: __('OpenAI: GPT-4', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-4-0314', label: __('OpenAI: GPT-4 (older v0314)', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-4-1106-preview', label: __('OpenAI: GPT-4 Turbo (older v1106)', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-4-32k', label: __('OpenAI: GPT-4 32k', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-4-32k-0314', label: __('OpenAI: GPT-4 32k (older v0314)', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-4-turbo', label: __('OpenAI: GPT-4 Turbo', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-4-turbo-preview', label: __('OpenAI: GPT-4 Turbo Preview', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-4-vision-preview', label: __('OpenAI: GPT-4 Vision', 'aibuddy-openai-chatgpt') },
                    { value: 'openai/gpt-4o', label: __('OpenAI: GPT-4o', 'aibuddy-openai-chatgpt') },
                    { value: 'openchat/openchat-7b', label: __('OpenChat 3.5', 'aibuddy-openai-chatgpt') },
                    { value: 'openchat/openchat-7b:free', label: __('OpenChat 3.5 (free)', 'aibuddy-openai-chatgpt') },
                    { value: 'open-orca/mistral-7b-openorca', label: __('Mistral OpenOrca 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'openrouter/cinematika-7b', label: __('Cinematika 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'openrouter/cinematika-7b:free', label: __('Cinematika 7B (free)', 'aibuddy-openai-chatgpt') },
                    { value: 'perplexity/pplx-70b-chat', label: __('Perplexity: PPLX 70B Chat', 'aibuddy-openai-chatgpt') },
                    { value: 'perplexity/pplx-70b-online', label: __('Perplexity: PPLX 70B Online', 'aibuddy-openai-chatgpt') },
                    { value: 'perplexity/pplx-7b-chat', label: __('Perplexity: PPLX 7B Chat', 'aibuddy-openai-chatgpt') },
                    { value: 'perplexity/pplx-7b-online', label: __('Perplexity: PPLX 7B Online', 'aibuddy-openai-chatgpt') },
                    { value: 'perplexity/sonar-medium-chat', label: __('Perplexity: Sonar 8x7B', 'aibuddy-openai-chatgpt') },
                    { value: 'perplexity/sonar-medium-online', label: __('Perplexity: Sonar 8x7B Online', 'aibuddy-openai-chatgpt') },
                    { value: 'perplexity/sonar-small-chat', label: __('Perplexity: Sonar 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'perplexity/sonar-small-online', label: __('Perplexity: Sonar 7B Online', 'aibuddy-openai-chatgpt') },
                    { value: 'phind/phind-codellama-34b', label: __('Phind: CodeLlama 34B v2', 'aibuddy-openai-chatgpt') },
                    { value: 'pygmalionai/mythalion-13b', label: __('Pygmalion: Mythalion 13B', 'aibuddy-openai-chatgpt') },
                    { value: 'recursal/eagle-7b', label: __('RWKV v5: Eagle 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'recursal/rwkv-5-3b-ai-town', label: __('RWKV v5 3B AI Town', 'aibuddy-openai-chatgpt') },
                    { value: 'rwkv/rwkv-5-world-3b', label: __('RWKV v5 World 3B', 'aibuddy-openai-chatgpt') },
                    { value: 'sophosympatheia/midnight-rose-70b', label: __('Midnight Rose 70B', 'aibuddy-openai-chatgpt') },
                    { value: 'teknium/openhermes-2-mistral-7b', label: __('OpenHermes 2 Mistral 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'teknium/openhermes-2.5-mistral-7b', label: __('OpenHermes 2.5 Mistral 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'togethercomputer/stripedhyena-hessian-7b', label: __('StripedHyena Hessian 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'togethercomputer/stripedhyena-nous-7b', label: __('StripedHyena Nous 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'undi95/remm-slerp-l2-13b', label: __('ReMM SLERP 13B', 'aibuddy-openai-chatgpt') },
                    { value: 'undi95/remm-slerp-l2-13b:extended', label: __('ReMM SLERP 13B (extended)', 'aibuddy-openai-chatgpt') },
                    { value: 'undi95/toppy-m-7b', label: __('Toppy M 7B', 'aibuddy-openai-chatgpt') },
                    { value: 'undi95/toppy-m-7b:free', label: __('Toppy M 7B (free)', 'aibuddy-openai-chatgpt') },
                    { value: 'xwin-lm/xwin-lm-70b', label: __('Xwin 70B', 'aibuddy-openai-chatgpt') }
                ]
            }
        )
    }
    
    return modelList;
}

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();
    const [isLoading, setIsLoading] = useState(false);
    const [model, setModel] = useState(null);
    const [options, setOptions] = useState(null);
    const [language, setLanguage] = useState('English');
    const [writingTone, setWritingTone] = useState('Neutral');
    const [writingStyle, setWritingStyle] = useState('Descriptive');
    const [previewContent, setPreviewContent] = useState('');
    const [isApiResponseReceived, setIsApiResponseReceived] = useState(false);

    useEffect(() => {
        const fetchOption = async () => {
            const response = await fetch('/wp-json/ai-buddy/v1/settings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': ai_buddy_localized_data.ai_buddy_content_builder.nonce
                },
            });
            const option = await response.json();
            let modelValue = 'gpt-3.5-turbo'; // default value

            if (options && options.settings && options.settings.fse && options.settings.fse.model) {
                modelValue = options.settings.fse.model;
            }

            setModel(modelValue);
            setOptions(option.settings ? option.settings : false);
        };
        fetchOption();
    }, []);

    const { title, categoryNames, tagNames } = collectPostMeta();
    if (options && !(options.openai && options.openai.apikey)) {
        return (
            <div { ...blockProps }>
                <p>{ __( 'Please enter your OpenAI API key from AI Bud Settings!', 'aibuddy-openai-chatgpt' ) }</p>
            </div>
        );
    }
    const modelList = getModelList(options);

    const translatedLanguages = [
        { value: 'Arabic', label: __('Arabic', 'aibuddy-openai-chatgpt') },
        { value: 'Bulgarian', label: __('Bulgarian', 'aibuddy-openai-chatgpt') },
        { value: 'Chinese', label: __('Chinese', 'aibuddy-openai-chatgpt') },
        { value: 'Croatian', label: __('Croatian', 'aibuddy-openai-chatgpt') },
        { value: 'Czech', label: __('Czech', 'aibuddy-openai-chatgpt') },
        { value: 'Danish', label: __('Danish', 'aibuddy-openai-chatgpt') },
        { value: 'Dutch', label: __('Dutch', 'aibuddy-openai-chatgpt') },
        { value: 'English', label: __('English', 'aibuddy-openai-chatgpt') },
        { value: 'Estonian', label: __('Estonian', 'aibuddy-openai-chatgpt') },
        { value: 'Filipino', label: __('Filipino', 'aibuddy-openai-chatgpt') },
        { value: 'Finnish', label: __('Finnish', 'aibuddy-openai-chatgpt') },
        { value: 'French', label: __('French', 'aibuddy-openai-chatgpt') },
        { value: 'German', label: __('German', 'aibuddy-openai-chatgpt') },
        { value: 'Greek', label: __('Greek', 'aibuddy-openai-chatgpt') },
        { value: 'Hebrew', label: __('Hebrew', 'aibuddy-openai-chatgpt') },
        { value: 'Hindi', label: __('Hindi', 'aibuddy-openai-chatgpt') },
        { value: 'Hungarian', label: __('Hungarian', 'aibuddy-openai-chatgpt') },
        { value: 'Indonesian', label: __('Indonesian', 'aibuddy-openai-chatgpt') },
        { value: 'Italian', label: __('Italian', 'aibuddy-openai-chatgpt') },
        { value: 'Japanese', label: __('Japanese', 'aibuddy-openai-chatgpt') },
        { value: 'Korean', label: __('Korean', 'aibuddy-openai-chatgpt') },
        { value: 'Latvian', label: __('Latvian', 'aibuddy-openai-chatgpt') },
        { value: 'Lithuanian', label: __('Lithuanian', 'aibuddy-openai-chatgpt') },
        { value: 'Malay', label: __('Malay', 'aibuddy-openai-chatgpt') },
        { value: 'Norwegian', label: __('Norwegian', 'aibuddy-openai-chatgpt') },
        { value: 'Polish', label: __('Polish', 'aibuddy-openai-chatgpt') },
        { value: 'Portuguese', label: __('Portuguese', 'aibuddy-openai-chatgpt') },
        { value: 'Romanian', label: __('Romanian', 'aibuddy-openai-chatgpt') },
        { value: 'Russian', label: __('Russian', 'aibuddy-openai-chatgpt') },
        { value: 'Serbian', label: __('Serbian', 'aibuddy-openai-chatgpt') },
        { value: 'Slovak', label: __('Slovak', 'aibuddy-openai-chatgpt') },
        { value: 'Slovenian', label: __('Slovenian', 'aibuddy-openai-chatgpt') },
        { value: 'Spanish', label: __('Spanish', 'aibuddy-openai-chatgpt') },
        { value: 'Swedish', label: __('Swedish', 'aibuddy-openai-chatgpt') },
        { value: 'Thai', label: __('Thai', 'aibuddy-openai-chatgpt') },
        { value: 'Turkish', label: __('Turkish', 'aibuddy-openai-chatgpt') },
        { value: 'Ukrainian', label: __('Ukrainian', 'aibuddy-openai-chatgpt') },
        { value: 'Vietnamese', label: __('Vietnamese', 'aibuddy-openai-chatgpt') }
    ];

    const writingTones = [
        { value: 'Neutral', label: __('Neutral', 'aibuddy-openai-chatgpt') },
        { value: 'Formal', label: __('Formal', 'aibuddy-openai-chatgpt') },
        { value: 'Assertive', label: __('Assertive', 'aibuddy-openai-chatgpt') },
        { value: 'Cheerful', label: __('Cheerful', 'aibuddy-openai-chatgpt') },
        { value: 'Humorous', label: __('Humorous', 'aibuddy-openai-chatgpt') },
        { value: 'Informal', label: __('Informal', 'aibuddy-openai-chatgpt') },
        { value: 'Inspirational', label: __('Inspirational', 'aibuddy-openai-chatgpt') },
        { value: 'Professional', label: __('Professional', 'aibuddy-openai-chatgpt') },
        { value: 'Coincidental', label: __('Coincidental', 'aibuddy-openai-chatgpt') },
        { value: 'Emotional', label: __('Emotional', 'aibuddy-openai-chatgpt') },
        { value: 'Persuasive', label: __('Persuasive', 'aibuddy-openai-chatgpt') },
        { value: 'Supportive', label: __('Supportive', 'aibuddy-openai-chatgpt') },
        { value: 'Sarcastic', label: __('Sarcastic', 'aibuddy-openai-chatgpt') },
        { value: 'Condescending', label: __('Condescending', 'aibuddy-openai-chatgpt') },
        { value: 'Skeptical', label: __('Skeptical', 'aibuddy-openai-chatgpt') },
        { value: 'Narrative', label: __('Narrative', 'aibuddy-openai-chatgpt') },
        { value: 'Journalistic', label: __('Journalistic', 'aibuddy-openai-chatgpt') }
    ];

    const writingStyles = [
        { value: 'Descriptive', label: __('Descriptive', 'aibuddy-openai-chatgpt') },
        { value: 'Informative', label: __('Informative', 'aibuddy-openai-chatgpt') },
        { value: 'Creative', label: __('Creative', 'aibuddy-openai-chatgpt') },
        { value: 'Narrative', label: __('Narrative', 'aibuddy-openai-chatgpt') },
        { value: 'Persuasive', label: __('Persuasive', 'aibuddy-openai-chatgpt') },
        { value: 'Reflective', label: __('Reflective', 'aibuddy-openai-chatgpt') },
        { value: 'Argumentative', label: __('Argumentative', 'aibuddy-openai-chatgpt') },
        { value: 'Analytical', label: __('Analytical', 'aibuddy-openai-chatgpt') },
        { value: 'Journalistic', label: __('Journalistic', 'aibuddy-openai-chatgpt') },
        { value: 'Technical', label: __('Technical', 'aibuddy-openai-chatgpt') }
    ];

    return (
        <div { ...blockProps }>
            <Flex className={'wp-block-aibud-content-generator-title-wrapper'}>
                <FlexItem>
                    <AiBuddyLogo />
                </FlexItem>
                <FlexItem className={'wp-block-aibud-content-generator-title'}>
                    {__('AI Buddy Content Generator', 'aibuddy-openai-chatgpt')}
                </FlexItem>
            </Flex>
            
            <PanelBody className={'wp-block-aibud-content-generator-advanced-title'} title={ __( 'Advanced Options', 'aibuddy-openai-chatgpt' ) } initialOpen={ false }>
                <PanelRow>
                    <Flex>
                        <FlexItem
                            isBlock={ true }
                        >
                            <label htmlFor="aibud-content-generator-ai-model">
                                { __('AI Model', 'aibuddy-openai-chatgpt') }
                            </label>
                            <Select
                                options={modelList}
                                onChange= { ( model ) => setModel( model.value ) }
                                inputId="aibud-content-generator-ai-model"
                                value={modelList.flatMap(selectedBrand => selectedBrand.options).find(selectedModel => selectedModel.value === model)}
                            />
                        </FlexItem>
                        <FlexItem
                            isBlock={ true }
                        >
                            <label htmlFor="aibud-content-generator-language">
                                { __('Language', 'aibuddy-openai-chatgpt') }
                            </label>
                            <Select
                                options={translatedLanguages}
                                onChange={(e) => setLanguage(e.value)}
                                inputId="aibud-content-generator-language"
                                value={translatedLanguages.find(function (option) {
                                    return option.value === language;
                                })}
                            />
                        </FlexItem>
                    </Flex>
                </PanelRow>
                <PanelRow>
                    <Flex>
                        <FlexItem
                            isBlock={ true }
                        >
                            <label htmlFor="aibud-content-generator-writing-style">
                                { __('Writing style', 'aibuddy-openai-chatgpt') }
                            </label>
                            <Select
                                options={writingStyles}
                                onChange={(e) => setWritingStyle(e.value)}
                                inputId="aibud-content-generator-writing-style"
                                value={writingStyles.find(function (option) {
                                    return option.value === writingStyle;
                                })}
                            />
                        </FlexItem>
                        <FlexItem
                            isBlock={ true }
                        >
                            <label htmlFor="aibud-content-generator-writing-tone">
                                { __('Writing tone', 'aibuddy-openai-chatgpt') }
                            </label>
                            <Select
                                options={writingTones}
                                onChange={(e) => setWritingTone(e.value)}
                                inputId="aibud-content-generator-writing-tone"
                                value={writingTones.find(function (option) {
                                    return option.value === writingTone;
                                })}
                            />
                        </FlexItem>
                    </Flex>
                </PanelRow>
            </PanelBody>
            <Flex className={'wp-block-aibud-content-generator-prompt-wrapper'}>
                <FlexItem isBlock={true}>
                    <RichText
                        tagName="p"
                        className={"wp-block-aibud-content-generator-prompt"}
                        value={ attributes.text }
                        onChange={ ( text ) => setAttributes( { text } ) }
                        placeholder={ __( 'Write an article about La Sagrada Familia' ) }
                    />
                </FlexItem>
                <FlexItem>
                    <Button
                        isPrimary
                        className={ 'wp-block-aibud-content-generator-button' }
                        onClick={ async () => {
                            setIsLoading(true);
                            const prompt = handlePromptChange(attributes.text, title, categoryNames, tagNames, language, writingStyle, writingTone);
                            const generatedText = await getApiResponse(prompt, model);
                            setPreviewContent(generatedText);
                            setIsApiResponseReceived(true);
                            setIsLoading(false);
                        } }
                        disabled={ !attributes.text }
                    >
                        { isLoading ? <Spinner /> : __( 'Run Prompt', 'aibuddy-openai-chatgpt' ) }
                    </Button>
                </FlexItem>
            </Flex>

            {isApiResponseReceived && (
                <Flex direction={'column'} align={'self-end'} className={'wp-block-aibud-content-generator-preview-wrapper'}>
                    <FlexItem isBlock={true}>
                        <div className={ 'wp-block-aibud-content-generator-preview' }>
                            <TextareaControl
                                label={ __( 'Content', 'aibuddy-openai-chatgpt' ) }
                                value={previewContent}
                                onChange={(content) => setPreviewContent(content)}
                            />
                        </div>
                    </FlexItem>
                    <FlexItem>
                        <Button
                            isPrimary
                            className={ 'wp-block-aibud-content-generator-button' }
                            onClick={ () => {
                                const content = convertMarkdownToHTML(previewContent);
                                createNewBlock(content);
                                setPreviewContent('');
                            } }
                            disabled={ !previewContent }
                        >
                            { __( 'Use this content', 'aibuddy-openai-chatgpt' ) }
                        </Button>
                    </FlexItem>
                </Flex>
            )}
        </div>
    );
}
