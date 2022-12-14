let stylesAdded = false;

const addStyles = (): void => {
    const styleTag: HTMLStyleElement = document.createElement('style');
    styleTag.innerHTML = `
    .dapplet-widget-menu {
      display: inline-block;
    }

    .dapplet-widget-results {
      display: flex;
      justify-content: center;
    }
  `;
    document.head.appendChild(styleTag);
};

export interface IButtonState {
    img: string;
    label: string;
    icon: string;
    loading: boolean;
    disabled: boolean;
    hidden: boolean;
    tooltip: string;
    isActive: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exec: (ctx: any, me: IButtonState) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    init: (ctx: any, me: IButtonState) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx: any;
    insPointName: string;
}

export class Button {
    public el: HTMLElement;
    public state: IButtonState;
    insPointName: string;

    public static contextInsPoints = {
        HIDE_TOKEN_BUTTON: 'HIDE_TOKEN_BUTTON',
        SHOW_ALL_BUTTON: 'SHOW_ALL_BUTTON',
        HIDE_NFT_COLLECTION_BUTTON: 'HIDE_NFT_COLLECTION_BUTTON',
        REMOVE_NFT_BUTTON: 'REMOVE_NFT_BUTTON',
        SHOW_ALL_NFT_COLLECTION_BUTTON: 'SHOW_ALL_NFT_COLLECTION_BUTTON',
        REMOVE_TOKEN_BUTTON: 'REMOVE_TOKEN_BUTTON',
    };

    public mount(): void {
        if (!this.el) this._createElement();
        if (!stylesAdded) {
            addStyles();
            stylesAdded = true;
        }

        const { img, label, icon, hidden, tooltip, isActive } = this.state;

        if (hidden) {
            this.el.innerHTML = '';
            this.el.style.display = 'none';
            return;
        } else {
            this.el.style.removeProperty('display');
        }

        // LP: 2. implement the button HTML with label, image and tooltip for two insert points: MENU and SEARCH_RESULT
        const activeNavEl: HTMLElement = document.querySelector('.hdtb-msel, .rQEFy');

        switch (this.insPointName) {
            case 'HIDE_TOKEN_BUTTON':
            case 'REMOVE_TOKEN_BUTTON':
            case 'HIDE_NFT_COLLECTION_BUTTON':
                this.el.innerHTML = `
                    <div 
                      style="
                        display: flex;
                        align-items: center;
                        cursor: pointer; 
                        margin-left: 10px;
                      "
                      ${tooltip ? `title="${tooltip}"` : ''}
                    >
                      <i class="${icon}" style="margin-top: 3px"></i>
                    </div>
                `;
                break;
            case 'REMOVE_NFT_BUTTON':
                this.el.innerHTML = `
                    <button
                        class="sc-bdvvtL ifrRMa gray-gray transfer-btn"
                      style="
                        margin-top: 15px;
                      "
                      ${tooltip ? `title="${tooltip}"` : ''}
                    >
                      <i class="${icon}" style="margin-top: 3px; margin-right: 5px; color: rgb(0, 90, 70)"></i>
                      ${label}
                    </button>
                `;
                break;
            case 'SHOW_ALL_BUTTON':
            case 'SHOW_ALL_NFT_COLLECTION_BUTTON':
                this.el.innerHTML = `
                    <div 
                      style="
                        display: flex; 
                        align-items: center;
                        cursor: pointer;
                      "
                      ${tooltip ? `title="${tooltip}"` : ''}
                    >
                      <span>${label}</span>
                    </div>
                `;
                break;
        }

        //   if (this.insPointName === 'MENU') {
        //       this.el.innerHTML = `
        //   <div style="margin: 1px 1px 0; padding: 16px 12px 12px 10px;
        //     ${isActive ? 'border-bottom: 3px solid #1a73e8; ' : 'border-bottom: none; '}
        //     display: inline; cursor: pointer; background: #ff0"
        //     ${tooltip ? `title="${tooltip}"` : ''}
        //   >
        //     <img style="width: 20px; margin-right: 5px; margin-bottom: -5px;" src="${img}"/>
        //     <div style="display: inline-block; font-size: 13px; line-hight: 16px; ${
        //         isActive
        //             ? 'color: #1a73e8;'
        //             : '-webkit-tap-highlight-color: rgba(0,0,0,.10); color: #5f6368;'
        //     }">${label}</div>
        //   </div>
        // `;
        //       activeNavEl.style.borderBottom = isActive ? 'none' : '3px solid #1a73e8';
        //   } else if (
        //       this.insPointName === 'SEARCH_RESULT' ||
        //       this.insPointName === 'DAPPLET_SEARCH_RESULT'
        //   ) {
        //       this.el.innerHTML = `
        //   <div
        //     style="display: flex; align-items: center; cursor: pointer;"
        //     ${tooltip ? `title="${tooltip}"` : ''}
        //   >
        //     <img style="width: 20px; margin-right: 1em; margin-bottom: 3px;" src="${img}"/>
        //     <div style="display: inline-block; font-size: 1.1em; color: #555; font-weight: 200;">${label}</div>
        //   </div>
        // `;
        //   } else if (this.insPointName === 'HIDE_TOKEN_BUTTON') {
        //       this.el.innerHTML = `
        //   <div
        //     style="display: flex; align-items: center; cursor: pointer;"
        //     ${tooltip ? `title="${tooltip}"` : ''}
        //   >
        //     <i class="${icon}" style="margin-top: 3px"></i>
        //   </div>
        // `;
        //   } else if (this.insPointName === 'SHOW_ALL_BUTTON') {
        //       this.el.innerHTML = `
        //   <div
        //     style="display: flex; align-items: center; cursor: pointer;"
        //     ${tooltip ? `title="${tooltip}"` : ''}
        //   >
        //     <span>${label}</span>
        //   </div>
        // `;
        //   }

        // LP end
    }

    public unmount(): void {
        this.el && this.el.remove();
    }

    private _createElement() {
        this.el = document.createElement('div');
        // LP: 3. add styles for the element depending on the insertion point
        if (this.insPointName === 'MENU') {
            this.el.classList.add('dapplet-widget-menu');
        } else {
            this.el.classList.add('dapplet-widget-results');
        }
        // LP end
        this.el.addEventListener('click', () => {
            if (!this.state.disabled) {
                this.state.exec?.(this.state.ctx, this.state);
            }
        });
        this.state.init?.(this.state.ctx, this.state);
    }
}
