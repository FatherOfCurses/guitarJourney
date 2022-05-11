'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">guitar-journey documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-8ad8c2cbaae82cd9b670931cdaa219e6973607dae16715f9357ff6ef05da63a70a9153f890fd9f2da6ed9cf3b5cdb4c4c235284133526060ddb3858ad4c0edad"' : 'data-target="#xs-components-links-module-AppModule-8ad8c2cbaae82cd9b670931cdaa219e6973607dae16715f9357ff6ef05da63a70a9153f890fd9f2da6ed9cf3b5cdb4c4c235284133526060ddb3858ad4c0edad"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-8ad8c2cbaae82cd9b670931cdaa219e6973607dae16715f9357ff6ef05da63a70a9153f890fd9f2da6ed9cf3b5cdb4c4c235284133526060ddb3858ad4c0edad"' :
                                            'id="xs-components-links-module-AppModule-8ad8c2cbaae82cd9b670931cdaa219e6973607dae16715f9357ff6ef05da63a70a9153f890fd9f2da6ed9cf3b5cdb4c4c235284133526060ddb3858ad4c0edad"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LandingPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LandingPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreviousSessionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreviousSessionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SessionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SessionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SidebarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SessionModule.html" data-type="entity-link" >SessionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SessionModule-edc1554d6df7bfc3710bd2999dc0ad48eb540a86162b8219d6220db902f40eb87dc6e1b73634c250fb8175ead4634c52912d39eb0eb1f8a539f2f6b334964e7e"' : 'data-target="#xs-components-links-module-SessionModule-edc1554d6df7bfc3710bd2999dc0ad48eb540a86162b8219d6220db902f40eb87dc6e1b73634c250fb8175ead4634c52912d39eb0eb1f8a539f2f6b334964e7e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SessionModule-edc1554d6df7bfc3710bd2999dc0ad48eb540a86162b8219d6220db902f40eb87dc6e1b73634c250fb8175ead4634c52912d39eb0eb1f8a539f2f6b334964e7e"' :
                                            'id="xs-components-links-module-SessionModule-edc1554d6df7bfc3710bd2999dc0ad48eb540a86162b8219d6220db902f40eb87dc6e1b73634c250fb8175ead4634c52912d39eb0eb1f8a539f2f6b334964e7e"' }>
                                            <li class="link">
                                                <a href="components/DisplaySessionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DisplaySessionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SidebarModule.html" data-type="entity-link" >SidebarModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SongModule.html" data-type="entity-link" >SongModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SongModule-cfc06fb7898951c69db2b0634a7d46e1a5deb003aa41a7d16a1d088ac1cfd5c65c25e55c214127e343bc25c936172403c47bb7b22954babff7a1302b6a45d4ce"' : 'data-target="#xs-components-links-module-SongModule-cfc06fb7898951c69db2b0634a7d46e1a5deb003aa41a7d16a1d088ac1cfd5c65c25e55c214127e343bc25c936172403c47bb7b22954babff7a1302b6a45d4ce"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SongModule-cfc06fb7898951c69db2b0634a7d46e1a5deb003aa41a7d16a1d088ac1cfd5c65c25e55c214127e343bc25c936172403c47bb7b22954babff7a1302b6a45d4ce"' :
                                            'id="xs-components-links-module-SongModule-cfc06fb7898951c69db2b0634a7d46e1a5deb003aa41a7d16a1d088ac1cfd5c65c25e55c214127e343bc25c936172403c47bb7b22954babff7a1302b6a45d4ce"' }>
                                            <li class="link">
                                                <a href="components/SongComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SongComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ChordObject.html" data-type="entity-link" >ChordObject</a>
                            </li>
                            <li class="link">
                                <a href="classes/Convertors.html" data-type="entity-link" >Convertors</a>
                            </li>
                            <li class="link">
                                <a href="classes/Note.html" data-type="entity-link" >Note</a>
                            </li>
                            <li class="link">
                                <a href="classes/Option.html" data-type="entity-link" >Option</a>
                            </li>
                            <li class="link">
                                <a href="classes/Session.html" data-type="entity-link" >Session</a>
                            </li>
                            <li class="link">
                                <a href="classes/SongsterrResponse.html" data-type="entity-link" >SongsterrResponse</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/SessionService.html" data-type="entity-link" >SessionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SongsterrService.html" data-type="entity-link" >SongsterrService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Barre.html" data-type="entity-link" >Barre</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChordConfigure.html" data-type="entity-link" >ChordConfigure</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChordLayout.html" data-type="entity-link" >ChordLayout</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SongsterrArtist.html" data-type="entity-link" >SongsterrArtist</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Window.html" data-type="entity-link" >Window</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});