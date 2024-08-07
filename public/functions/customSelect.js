// customSelect.js
import { fetchSimplifiedState } from './simplifiedState.js';

// imageSelector.js
export class ImageSelector {
    constructor(containerId, options, onChange, initialSelectedValue = null) {
        this.containerId = containerId;
        this.options = options;
        this.onChange = onChange;
        this.container = document.getElementById(containerId);
        this.selectedValue = initialSelectedValue;
        this.init();
    }

    init() {
        if (!this.container) {
            throw new Error(`No element found with ID: ${this.containerId}`);
        }

        this.container.innerHTML = '';
        this.createSearchInput();
        this.createDropdown();
        this.populateOptions();
        this.addEventListeners();

        if (this.selectedValue !== null) {
            this.setSelectedOption(this.options.find(opt => opt.value === this.selectedValue));
        }
    }

    createSearchInput() {
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = 'Search options...';
        this.input.classList.add('image-select-input');
        this.container.appendChild(this.input);
    }

    createDropdown() {
        this.dropdown = document.createElement('div');
        this.dropdown.classList.add('image-select-dropdown');
        this.container.appendChild(this.dropdown);
    }

    populateOptions() {
        this.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('image-select-option');
            optionElement.innerHTML = `
                <img src="${option.imageUrl}" alt="${option.name}" style="width:20px; height:20px;"/>
                ${option.name} ${option.description ? `(${option.description})` : ''}
            `;
            optionElement.dataset.value = option.value;
            this.dropdown.appendChild(optionElement);

            optionElement.addEventListener('click', () => this.setSelectedOption(option));
        });
    }

    setSelectedOption(option) {
        this.input.value = option.name;
        this.input.dataset.value = option.value;
        this.selectedValue = option.value;
        this.dropdown.classList.remove('show');
        if (this.onChange && typeof this.onChange === 'function') {
            this.onChange(this.containerId, option.value);
        }
    }

    addEventListeners() {
        this.input.addEventListener('focus', () => this.dropdown.classList.add('show'));
        this.input.addEventListener('blur', () => {
            setTimeout(() => this.dropdown.classList.remove('show'), 200);
        });
        this.input.addEventListener('input', this.filterOptions.bind(this));
    }

    filterOptions() {
        const filter = this.input.value.toLowerCase();
        const options = this.dropdown.querySelectorAll('.image-select-option');
        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(filter) ? '' : 'none';
        });
    }

    getValue() {
        return this.selectedValue;
    }

    setValue(value) {
        const option = this.options.find(opt => opt.value === value);
        if (option) {
            this.setSelectedOption(option);
        }
    }

    addOption(option) {
        this.options.push(option);
        const optionElement = document.createElement('div');
        optionElement.classList.add('image-select-option');
        optionElement.innerHTML = `
            <img src="${option.imageUrl}" alt="${option.name}" style="width:20px; height:20px;"/>
            ${option.name} ${option.description ? `(${option.description})` : ''}
        `;
        optionElement.dataset.value = option.value;
        this.dropdown.appendChild(optionElement);
        optionElement.addEventListener('click', () => this.setSelectedOption(option));
    }
}

// Función para crear el selector de imágenes
export function createImageSelector(containerId, options, onChange, initialSelectedValue = null) {
    return new ImageSelector(containerId, options, onChange, initialSelectedValue);
}