import twigToJSX from './twig-to-jsx';

window.onload = () => {
  let twig = `{% set classes = [
    'badge bg-backgroundNeutral-neutralMedium rounded-2xl capitalize textSm-medium text-text-heading',
    type == "only-icon" ? 'badge-text-empty',
    size == "small" ? 'icon-sm',
    size == "medium" ? 'icon-md',
    size == "large" ? 'icon-lg',
  ] %}

  {% set icon_size = 'w-1.5 h-1.5 -mt-0.5 ml-px inline-block' %}

  {# Template #}
  {% block badge_block %}
    <span class='{{ attributes.addClass(classes) }}' >

      {% if type == "text-only" %}
        <a href="abc.com">
        {{ text }}
        </a>
      {% endif %}
    </span>
  {% endblock %}`;

  console.log(twigToJSX(twig));
};

