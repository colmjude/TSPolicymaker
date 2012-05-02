(function($, tw) {

	var bag,
		host,
		form,
		space,
		owner,
		publicPolicy,
		privatePolicy;

	function guestView() {
		$(".policy-view")
			.addClass("disabled")
			.find("input, button")
				.attr("disabled", "disabled");

		$(".guest-view").show();

	}

	function policyView() {
		var $pview = $(".policy-view");
		$(".policy-view section h3 strong").text(space);
		form = $(".policy-view form");
		var porp = $(".policy-view").attr("data-privacy");

		$("button.public", $pview).click(function() {
			if($pview.hasClass("private")) {
				$pview
					.removeClass("private")
					.addClass("public")
					.attr("data-privacy", "public");
				fetchPolicy("public");
			}
		});
		$("button.private", $pview).click(function() {
			if($pview.hasClass("public")) {
				$pview
					.removeClass("public")
					.addClass("private")
					.attr("data-privacy", "private");
				fetchPolicy("private");
			}
		});

		fetchPolicy(porp);
		setFormHandlers(form);
	}

	function fetchPolicy(type, callback) {
		bag = new tw.Bag(space + "_" + type, host);
		bag.get(function(resource, status, xhr) {
			// on success
			owner = resource.policy.owner;
			populateForm(resource.policy);
			if(callback) {
				callback();
			}
		}, function(xhr, error, exc) {
			// error occurred
			console.log("error fetching");
			console.log(xhr, error, exc);
		});
	}

	function savePolicy(policy, successCB, errorCB) {
		console.log(policy);
		bag.policy = $.extend(bag.policy, policy);
		console.log(bag.policy);
		bag.put(function(resource, status, xhr) {
			// success
			if(successCB) {
				successCB(resource, status, xhr);
			}
		}, function(xhr, error, exc) {
			// error
			if(errorCB) {
				errorCB(xhr, error, exc);
			}
		});
	}
	
	function populateForm(policy) {
		form.find("#readinput")
			.val( policy.read.join(",") )
			.attr( "data-original", policy.read.join(",") );
		form.find("#writeinput")
			.val( policy.write.join(",") )
			.attr( "data-original", policy.write.join(",") );
		form.find("#deleteinput")
			.val( policy["delete"].join(",") )
			.attr( "data-original", policy["delete"].join(",") );
		form.find("#manageinput")
			.val( policy.manage.join(",") )
			.attr( "data-original", policy.manage.join(",") );
		form.find("#acceptinput")
			.val( policy["accept"].join(",") )
			.attr( "data-original", policy["accept"].join(",") );;
		form.find("#createinput")
			.val( policy.create.join(",") )
			.attr( "data-original", policy.create.join(",") );
	}
	
	function setFormHandlers(form) {
		
		form.find(".reset").click(function(e) {
			e.preventDefault();
			// reset the field values to their original
			form.find("input").each(function(i,el) {
				var $el = $(el);
				$el.val( $el.attr("data-original") );
			});
		});

		form.find(".submit").click(function(e) {
			e.preventDefault();
			var newpolicy = {
				owner: owner
			};
			form.find("input").each(function(i, el) {
				var $el = $(el),
					name = $el.attr("name"),
					val = $el.val();
				
				newpolicy[name] = (val === "") ? [] : val.replace(/ /g,'').split(",");
			})
			savePolicy(newpolicy, function(r,s,x){
				console.log(s);
			}, function(x,er,ex) {
				console.log(er);
			});
		});

		// input focusing
		form.find("input").focus(function(e){
			$(e.target).addClass("editing");
		}).blur(function(e){
			var $me = $(e.target);
			$me.removeClass("editing");
			if($me.val() !== $me.attr("data-original")) {
				$me.addClass("changed");
			}
		});
	}

	/*
	 * Start up, establishing if the current user has the power to edit.
	 */
	function init() {

		$.ajaxSetup({
			beforeSend: function(xhr) {
				xhr.setRequestHeader("X-ControlView", "false");
			}
		});

		var url = '/status',
			devHost = false;

		if (window.location.href.match(/^file:/)) {
			// for dev
			url = '/status';
			devHost = true;
		}

		$.ajax({
			dataType: 'json',
			url: url,
			success: function(data) {
				//space = data.space.name || "policymaker";
				space = (data.space) ? data.space.name : "policymaker";
				host = '/';
				if (devHost) {
					host = data.server_host.scheme + '://'
					+ space + '.' + data.server_host.host + '/';
				}
				if (data.username === 'GUEST') {
					guestView();
				} else {
					$.ajax({
						url: host + 'spaces/' + space + '/members',
						success: policyView,
						error: guestView,
					});
				}
			}
		});
	}

	init();

})(jQuery, tiddlyweb);
