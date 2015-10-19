(function(ng) {

    var mod = ng.module('longPlayModule');

    var cCtrl = 'catalogCtrl';
    var cc = 'CrudCreator';
    var lpServ = 'longPlayService';
    var lpMod = 'longPlayModel';
    var cIServ = 'cartItemService';
    var cServ = 'commentService';
    var qServ = 'questionService';

    mod.controller(cCtrl, [cc, '$scope', '$route', lpServ, lpMod, cIServ, '$location', cServ, qServ,
        function(CrudCreator, $scope, $route, svc, model, cartItemSvc, $location, cmScv, qScv) {

            CrudCreator.extendController(this, svc, $scope, $route, model, 'catalog', 'Catalog');
            this.asGallery = true;
            this.readOnly = true;
            this.detailsMode = false;
            this.myTextArea = "";
            var self = this;
            $scope.answerMode = [];
            this.idCommentPadre = 0;

            $scope.modal = {url: 'src/modules/question/question.tpl.html', data: null, question: ''};


            this.searchByName = function(albumName) {
                var search;
                if (albumName) {
                    search = '?q=' + albumName;
                }
                $location.url('/catalog' + search);
            };

            this.registerQuestion = function() {
                var result = false;
                result = qScv.registerQuestion($scope.modal.data, $scope.modal.question);
                if (result) {
                    $scope.modal.data = null;
                    $scope.modal.question = '';
                }
            };

            this.addComment = function(record, commentReg) {
                if (commentReg.trim().length !== 0)
                {
                    cmScv.createComment(record, commentReg, null);
                    this.answerMode = false;
                    this.refreshComment(record);
                }
                $scope.commentReg = "";
                this.refreshComment(record);
            };

            this.refreshComment = function(record) {
                svc.api.get(record.id).then(function(data) {
                    self.detailsModel = true;
                    $scope.model = data;
                });
                this.fetchRecords();
            };

            this.findItem = function(priceMax) {
                svc.findItem(priceMax).then(function(results) {
                    $scope.records = [];
                    $scope.records = results;
                });
            };

            this.playSong = function(record, song) {

                jwplayer("player" + record.id).setup({
                    playlist: [
                        {
                            file: song.sample,
                            title: song.title,
                            image: record.album.cover,
                            description: record.comments
                        }
                    ]
                });
            };

            this.addAnswer = function(record, answer) {
                if (answer.trim().length !== 0)
                {
                    cmScv.createComment(record, answer, this.idCommentPadre);
                    this.answerMode = false;
                    this.refreshComment(record);
                }
                this.refreshComment(record);
            };

            this.recordActions = [{
                    name: 'addToCart',
                    displayName: 'Add to Cart',
                    icon: 'shopping-cart',
                    class: 'primary',
                    fn: function(longPlay) {
                        return cartItemSvc.addItem({
                            longPlay: longPlay,
                            name: longPlay.name,
                            quantity: 1
                        });
                    },
                    show: function() {
                        return true;
                    }
                },
                {
                    name: 'addQuestion',
                    displayName: 'Add Question',
                    icon: 'question-sign',
                    class: 'info',
                    fn: function(record) {
                        $scope.modal.data = record;
                        $scope.modal.question = '';
                        return true;
                    },
                    show: function() {
                        return true;
                    }
                },
                {
                    name: 'comments',
                    displayName: 'Comments',
                    icon: 'list',
                    class: 'info',
                    fn: function(record) {
                        svc.api.get(record.id).then(function(data) {
                            self.detailsMode = true;
                            self.findCheapMode = false;
                            $scope.model = data;
                        });
                    },
                    show: function() {
                        return !self.detailsMode;
                    }
                },
                {
                    name: 'songList',
                    displayName: 'Song List',
                    icon: 'music',
                    class: 'info',
                    fn: function(record) {
                        if (record.songs.length > 0)
                            $('#song_modal_' + record.id).modal('show');
                        return true;
                    },
                    show: function() {
                        return true;
                    }
                }];

            this.fetchRecords();
        }]);

})(window.angular);
