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
/*global define,Promise*/

define(
    [],
    function () {
        "use strict";

        /**
         * Controller for the `browse-object` representation of a domain
         * object (the right-hand side of Browse mode.)
         * @memberof platform/commonUI/browse
         * @constructor
         */
        function BrowseObjectController($scope, $location, $route, $window) {
            function setViewForDomainObject(domainObject) {
                var locationViewKey = $location.search().view;

                function selectViewIfMatching(view) {
                    if (view.key === locationViewKey) {
                        $scope.representation = $scope.representation || {};
                        $scope.representation.selected = view;
                    }
                }

                if (locationViewKey) {
                    ((domainObject && domainObject.useCapability('view')) || [])
                        .forEach(selectViewIfMatching);
                }
            }

            function updateQueryParam(viewKey) {
                var unlisten, priorRoute = $route.current;

                if (viewKey) {
                    $location.search('view', viewKey);
                    unlisten = $scope.$on('$locationChangeSuccess', function () {
                        // Checks path to make sure /browse/ is at front
                        // if so, change $route.current
                        if ($location.path().indexOf("/browse/") === 0) {
                            $route.current = priorRoute;
                        }
                        unlisten();
                    });
                }
            }

            // If there is a defined opener, assume that the window was opened 
            //   by choosing 'Open in a new tab'
            if ($window.opener) {
                // The desired default for this is to have a closed left pane
                $scope.ngModel.leftPane = false;
            } else {
                // Otherwise, start the application with an open left pane 
                $scope.ngModel.leftPane = true;
            }
            
            // The object inspector by default always starts closed
            $scope.ngModel.rightPane = false;
            
            $scope.$watch('domainObject', setViewForDomainObject);
            $scope.$watch('representation.selected.key', updateQueryParam);
        }

        return BrowseObjectController;
    }
);
