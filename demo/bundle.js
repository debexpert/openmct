/*****************************************************************************
 * Open MCT Web, Copyright (c) 2014-2015, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT Web is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT Web includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/
/*global define*/

define([
    "./src/conductor/DemoConductorRepresenter",
    "./src/DemoInitializer",
    "./src/conductor/ConductorServiceDecorator",
    "./src/conductor/DemoTelemetryDecorator",
    "./src/telemetry/DemoTelemetryProvider",
    "./src/DemoModelProvider",
    'text!./res/image-template.html',
    'legacyRegistry'
], function (
    DemoConductorRepresenter,
    DemoInitializer,
    ConductorServiceDecorator,
    DemoTelemetryDecorator,
    DemoTelemetryProvider,
    DemoModelProvider,
    ImageTemplate,
    legacyRegistry
) {
    "use strict";

    legacyRegistry.register("demo", {
        "name": "Live Demo configuration",
        "description": "Adds demo data types, and demo-specific behavior",
        "extensions": {
            "representers": [
                {
                    "implementation": DemoConductorRepresenter,
                    "depends": ["$q", "$compile", "conductorService", "views[]", "throttle", "navigationService"]
                }
            ],
            "components": [
                {
                    "implementation": ConductorServiceDecorator,
                    "provides": "conductorService",
                    "type": "decorator"
                },
                {
                    "implementation": DemoTelemetryProvider,
                    "type": "provider",
                    "provides": "telemetryService",
                    "depends": ["$q", "$timeout"]
                },
                {
                    "implementation": DemoModelProvider,
                    "provides": "modelService",
                    "type": "provider"
                },
            ],
            "runs": [
                {
                    "implementation": DemoInitializer,
                    "depends": [
                        "$timeout",
                        "representers[]",
                        "objectService",
                        "$location"
                    ]
                }
            ],
            "roots": [
                {
                    "id":"mct:demo",
                    "model": {
                        "type":"folder",
                        "name": "Examples",
                        "composition": []
                    },
                    "priority": "preferred"
                }
            ],
            "types": [
                {
                    "key": "demo-telemetry",
                    "name": "Spacecraft Telemetry Generator",
                    "glyph": "T",
                    "description": "Mock realtime spacecraft telemetry",
                    "features": "creation",
                    "model": {
                        "telemetry": {
                            "period": 10000,
                            "multiplier": 10
                        }
                    },
                    "telemetry": {
                        "source": "demo-telemetry",
                        "domains": [
                            {
                                "key": "time",
                                "name": "Time"
                            }
                        ],
                        "ranges": [
                            {
                                "key": "sin",
                                "name": "value"
                            }
                        ]
                    }
                },
                {
                    "key": "image-include",
                    "name": "Image include",
                    "glyph": "ã",
                    "description": "An image include that is resized to fit" +
                    " its container",
                    "views": [
                        "image-view"
                    ],
                    "properties": [
                        {
                            "key": "url",
                            "name": "URL",
                            "control": "textfield",
                            "pattern": "^(ftp|https?)\\:\\/\\/\\w+(\\.\\w+)*(\\:\\d+)?(\\/\\S*)*$",
                            "required": true,
                            "cssclass": "l-input-lg"
                        }
                    ]
                },
            ],
            "licenses": [
                {
                    "name": "Hopscotch",
                    "version": "0.2.5",
                    "author": "linkedin",
                    "description": "Hopscotch is a framework to make it easy" +
                    " for developers to add product tours to their pages.",
                    "license": "license-apache",
                    "website": "http://linkedin.github.io/hopscotch/",
                    "link": "https://raw.githubusercontent.com/linkedin/hopscotch/master/LICENSE"
                }
            ],
            "stylesheets": [
                {
                    "stylesheetUrl": "css/hopscotch.css",
                    priority: "fallback"

                },
                {
                    "stylesheetUrl": "css/tour.css"
                },
                {
                    "stylesheetUrl": "css/image.css"
                }
            ],
            "constants": [
                {
                    "key": "PLOT_FIXED_DURATION",
                    "value": 60000,
                    "comment": "1 minute."
                }
            ],
            "views": [
                {
                    "template": ImageTemplate,
                    "name": "ImageInclude",
                    "type": "image-include",
                    "key": "image-view",
                    "editable": false
                }
            ]
        }
    });
});