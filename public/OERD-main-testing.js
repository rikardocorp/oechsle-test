/* ===========
 * Proyecto:
 * Fecha Inicio:
 * Email Desarrollador:
 * ======== */

"use strict";

//var $ = $ || {},
//jQuery = jQuery || {},
// var Mustache = Mustache || {}; //Temporal

/**
 * Helpers
 */
$.js = function (el) {
	return $(js(el));
};
var js = function (el) {
	return '[data-js=' + el + ']';
};

var isset = function (el) {
	return $(el).html() != undefined ? true : false;
};

var isMobile = function () {
	return $(window).width() < 992 ? true : false;
};

/**
 * Base page, components, modules, services, cache
 */
var oe = oe || {};
var ECOMMERCES = ['Promart', 'plazavea', '1'];
console.log('RIKARDOCORP')

oe = (function ($, doc, win, undefined) {
	document.cookie = 'filtro-resultados-de-la-busqueda:_ft=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	var body = 'body',
		conf = {},
		helps = function () { },
		pages = function () { },
		com = function () { },
		mod = function () { },
		services = function () { },
		cache = function () { },

		init = function () {
			// oe.pages.common.init();

			$.each(oe.pages, function () {
				$(body).hasClass(this.pageClass) && this.hasOwnProperty('init') && this.init();
			});
		},

		constructor = (function () {
			var page = function (pageClass) {
				var s = this;
				s.pageClass = pageClass;

				s.DOMReady = function () { };
				s.winLoad = function () { };

				var _DOMReady = function () {
					$(doc).ready(function () {
						s.DOMReady();
					});
				},

					_winLoad = function () {
						s.winLoad();
					};

				s.init = function () {
					_DOMReady(), _winLoad();
				};
			};

			return {
				page: page,
			}
		})();

	return {
		contructor: constructor,
		init: init,
		pages: pages,
		com: com,
		mod: mod,
		services: services,
		cache: cache
	};
})($, document, window);

/**
 * Config
 */

oe.conf = oe.conf || {};

oe.conf = {
	search: '/api/catalog_system/pub/products/search/'
};

vtexjs.checkout.getOrderForm()
	.done(function (orderForm) {
		$('.cart-count').html(orderForm.items.length);
	});

/**
 * Module Events
 */
oe.helps = oe.helps || {};

oe.helps = (function ($, doc, win, undefined) {
	var priceFormat = function (val) {
		var num = val.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
		return num;
	},

		totalSum = function (data) {
			var sum = 0,
				len = (data ? data.length : 0);

			for (var i = 0; i < len; i++) {
				sum += (data[i].quantity * data[i].price);
			}
			return sum;
		},

		msgResp = function (status, msg) {
			return {
				status: status,
				msg: msg
			};
		},

		findById = function (data, id) {
			return data.filter(function (x) { return x.id == id; });
		},

		findIndexById = function (data, id) {
			return data.findIndex(function (x) { return x.id == id; });
		},

		remDecimalPerc = function () {
			// Quitar decimales en porcentajes
			$.each($('.product .flag-of, .product .flag-oh'), function (i, e) {
				var val = $(e).html();

				if (val != undefined && val.indexOf('percent') == -1)
					$(e).text(parseFloat($(e).text()).toFixed(0) + '%');
			});
		},

		remEmptyFilter = function () {
			// Ocultar los items con "-" del filtro
			$.each($('.refino .multi-search-checkbox'), function (i, e) {
				if ($(e).val() == '-') {
					$(e).parent().hide();
				}
			});
		},

		sliceNameProd = function () {
			$.each($('.prod-name'), function (i, e) {
				if ($(e).text().length > 41) {
					$(e).text($(e).text().substr(0, 41) + '...');
				}
			});
		},

		percentPrice = function (normalPrice, offertPrice) {
			return Math.floor(parseFloat(((normalPrice - offertPrice) / normalPrice) * 100));
		},

		priceParceFloat = function (price) {
			price = price.replace('S/. ', '').replace('S/ ', '');

			if (price.indexOf(',') > price.indexOf('.')) {
				price = parseFloat(price.replace(/\S\/. /g, "").replace(".", "").replace(",", "."));

			} else {
				price = parseFloat(price.replace('S/. ', '').replace('S/ ', '').replace(',', '').trim());
			}

			return price;
		},

		getSearchItemsTotal = function (query) {
			var deferred = $.Deferred();

			$.ajax({
				url: "/api/catalog_system/pub/products/search/" + (query || ""),
				type: "GET",
				headers: {
					resources: '0-0'
				},
				success: function (response, status, request) {
					deferred.resolve(request.getResponseHeader("resources").split("/").pop());
				},
				error: function () {
					deferred.reject();
				}
			});

			return deferred.promise();
		},

		spinner = function ($spn) {
			$spn.i2bSpinner()
				.on('valuemax', function () {
					var $tlp = $(this).prev(js('tooltip-price')),
						tlpActive = 'active';

					$tlp.addClass(tlpActive);
					setTimeout(function () {
						$tlp.removeClass(tlpActive);
					}, 3000);
				})
				.find('[name="qty"]')
				.bind('keypress', function (e) {
					var keyCode = e.which ? e.which : e.keyCode;
					return (keyCode <= 31 || (keyCode >= 48 && keyCode <= 57));
				})
				.bind('keyup', function (e) {
					if (Modernizr.mobile) {
						var $t = $(this);
						$t.val($t.val().replace(/[^0-9]/g, ""));
					}
				})
				.bind('blur', function (e) {
					var $t = $(this),
						val = $t.val();
					if (!val || val < 1) $t.val(1);
				});
		},

		shippingFree = function (val) {
			return val >= 599;
		}

	return {
		priceFormat: priceFormat,
		totalSum: totalSum,
		msgResp: msgResp,
		findById: findById,
		findIndexById: findIndexById,
		remDecimalPerc: remDecimalPerc,
		remEmptyFilter: remEmptyFilter,
		sliceNameProd: sliceNameProd,
		percentPrice: percentPrice,
		priceParceFloat: priceParceFloat,
		getSearchItemsTotal: getSearchItemsTotal,
		spinner: spinner,
		shippingFree: shippingFree
	}
})($, document, window);

/**
 * Module Events
 */
oe.mod.events = oe.mod.events || {};

oe.mod.events = (function ($, doc, win, undefined) {
	var evs = {},
		funct = 'function';

	function on(eventName, fn) {
		evs[eventName] = evs[eventName] || [];
		evs[eventName].push(fn);
	}

	function off(eventName, fn) {
		if (evs[eventName]) {
			var i = 0,
				length = evs[eventName].length;

			for (i; i < length; i++) {
				if (evs[eventName][i] === fn) {
					evs[eventName].splice(i, 1);
					break;
				}
			}
		}
	}

	function emit(eventName, data) {
		if (evs[eventName]) {
			evs[eventName].forEach(function (callback) {
				if (typeof callback === funct) {
					callback(data);
				}
			});
		}
	}

	return {
		on: on,
		off: off,
		emit: emit
	};
})($, document, window);

/**
 * Services Api server
 */
oe.services.api = oe.services.api || {};

oe.services.api = (function ($) {
	// var url = oe.conf.apiUrl,
	var getAll = function (srv) {
		return $.ajax({
			url: srv,
			method: 'GET'
		});
	},

		getById = function (srv, id) {
			id = (id ? id : null);

			return $.ajax({
				url: srv + '/' + id,
				method: 'GET'
			});
		},

		post = function (srv, data) {
			data = (data ? data : null);

			return $.ajax({
				url: srv,
				method: 'POST',
				data: data
			});
		},

		del = function (srv, id) {
			return $.ajax({
				url: srv + '/' + id,
				method: 'DELETE'
			});
		};

	return {
		getAll: getAll,
		getById: getById,
		post: post,
		del: del
	};
})($);

/**
 * Services Local Storage
 */
oe.services.ls = oe.services.ls || {};

oe.services.ls = (function (window) {
	var get = function (key) {
		if (key) {
			return JSON.parse(localStorage.getItem(key));

		} else {
			return null;
		}
	},

		set = function (key, data) {
			if (key && data) {
				localStorage.setItem(key, JSON.stringify(data));
			}
		},

		del = function (key, id) {
			localStorage.removeItem(key);
		};

	return {
		get: get,
		set: set,
		del: del
	};
})(window);

$(function () {
	var $tab = $.js('tab'),
		$cle = $.js('collapse'),
		$don = $.js('dropdown'),
		$spn = $.js('spinner-price');/*,
	$prosSl  = $.js('prods-rel-sl').find('ul.vitrina');*/

	if ($tab) { $tab.tabs(); }
	if ($cle) { $cle.collapse(); }
	if ($don) { $don.dropdown(); }
	/* if($spn) {
		$spn.i2bSpinner()
		.on('valuemax', function () {
			var $tlp = $(this).prev(js('tooltip-price')),
			tlpActive = 'active';

			$tlp.addClass(tlpActive);
			setTimeout(function () {
				$tlp.removeClass(tlpActive);
			}, 3000);
		})
	} */



	/* Open tab footer mobile */


	// Modales PDP //
	$.js('modal-open').modal();

	$.js('btn-menu').modal({
		overlay: '[menu-overlay]'
	})
		.on('beforehide', function (e) {
			var fm = $(this).attr('data-open'),
				$fm = $(fm);

			$fm.addClass('close')
				.parent().addClass('close');

			setTimeout(() => {
				$fm.removeClass('close')
					.parent().removeClass('close');
			}, 1000);
		});
});

/* Services Ini */

(function ($, doc, win, undefined) {
	var reqAct;
	oe.services.search = oe.services.search || {};

	oe.services.search.get = function (sc, codPrat, orderBy, nroItems, from, to, codColeccion, abortSw) {
		abortSw = (abortSw == null ? true : abortSw);

		if (abortSw && reqAct) {
			reqAct.abort();
		}

		reqAct = $.ajax({
			url: '/buscapagina?sc=' + sc + '&sl=' + codPrat + '&O=' + orderBy + '&PS=' + nroItems + '&cc=' + nroItems + '&sm=0' + (typeof codColeccion != 'undefined' ? ('&from=' + (typeof from != 'undefined' ? from : 1) + '&to=' + (typeof to != 'undefined' ? to : 15) + '&fq=' + codColeccion) : ''),
			type: 'GET',
			async: true,
			dataType: 'html'
		})
		return reqAct;
	}

	oe.services.search.getBy = function (params) {
		return oe.services.api.getById(oe.conf.search, params);
	}

})(jQuery, document, window);

/* Services Fin */

/* Utils Ini */

(function ($, doc, win, undefined) {
	oe.mod.utils = oe.mod.utils || {};

	oe.mod.utils.formatPrice = function (number, thousands, decimals, length, currency) {
		thousands = thousands || ',';
		decimals = decimals || '.';
		length = length || 2;
		currency = currency || 'S/ ';

		currency = this.currency ? this.currency : (typeof currency == "string" ? currency : "");
		length = typeof length !== 'number' ? 2 : length;

		var re = '\\d(?=(\\d{' + (3) + '})+' + (length > 0 ? '\\D' : '$') + ')';
		number = (number * 1).toFixed(Math.max(0, ~~length));

		return currency + number.replace('.', (decimals || ",")).replace(new RegExp(re, 'g'), '$&' + (thousands || '.'));
	};

	oe.mod.utils.objectSearch = function (object, needle) {
		var p, key, val, tRet;

		for (p in needle) {
			if (needle.hasOwnProperty(p)) {
				key = p;
				val = needle[p];
			}
		}

		for (p in object) {
			if (p == key) {
				if (object[p] == val) {
					return object;
				}
			} else if (object[p] instanceof Object) {
				if (object.hasOwnProperty(p)) {
					tRet = oe.mod.utils.objectSearch(object[p], needle);
					if (tRet) {
						return tRet;
					}
				}
			}
		}

		return false;
	}

	oe.mod.utils.sanitizeString = function (str, replace) {
		replace = typeof replace == "string" ? replace : "-";

		str = str.toLowerCase();
		str = str.replace(/[\[\]\(\)\-\{\}\^]/g, "");
		str = str.replace(/[àáâãäåª]/g, "a");
		str = str.replace(/[éèëê]/g, "e");
		str = str.replace(/[íìïî]/g, "i");
		str = str.replace(/[óòöô]/g, "o");
		str = str.replace(/[úùüû]/g, "u");
		str = str.replace(/[ñ]/g, "n");
		str = str.replace(/[ç]/g, "c");
		str = str.replace(/ /g, replace);
		return str;
	}

	oe.mod.utils.productsSliderInit = function ($sl) {
		if ($sl) {
			$sl.slick({
				slidesToShow: 2,
				slidesToScroll: 2,
				arrows: false,
				infinite: true,
				dots: true,
				speed: 500
			});
		}
	}

	oe.mod.utils.getProduct = function (product) {
		if (!("products" in oe.cache))
			oe.cache.products = {};

		if (typeof oe.cache.products[product] !== "undefined" && typeof oe.cache.products[product].done !== "undefined") { //Return promise
			return oe.cache.products[product];
		}

		return $.Deferred(function () {
			var def = this;

			if (typeof oe.cache.products[product] !== "undefined") //si el producto esta en cache lo devuelve
				return def.resolve(oe.cache.products[product]);

			oe.cache.products[product] = def;

			$.ajax({
				url: oe.conf.API_URL.SEARCH + "?fq=productId:" + product,
				dataType: "json",
				success: function (response) {
					oe.cache.products[product] = response.length > 0 ? response[0] : undefined;
					def.resolve(response[0]);
				},
				error: function () {
					oe.cache.products[product] = undefined;
					def.reject();
				}
			});
		}).promise();
	}

	oe.mod.utils.servicesRadioEvent = function ($cont) {
		if ($cont && $cont.length) {
			$cont.find('input:radio + label')
				.on('click', function () {
					var $t = $(this).prev(),
						name = $t.attr('name'),
						preValAttr = 'previousValue',
						preVal = $t.attr(preValAttr),
						event = 'checked';

					if (preVal == event) {
						setTimeout(function () {
							$t.removeAttr(event);
							$t.attr(preValAttr, '');
						}, 50);

					} else {
						$("input[name=" + name + "]:radio").attr(preValAttr, '');
						$t.attr(preValAttr, event);
					}
				});
		}
	}

	oe.mod.utils.getUrlParam = function (parm, url) {
		var query = url || window.location.search.substring(1),
			vars = query.split("&");

		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == parm) { return pair[1]; }
		}
		return (false);
	}

	oe.mod.utils.arrayUnique = function (arr) {
		return arr.filter(function (value, index, self) {
			return self.indexOf(value) === index;
		});
	}

})(jQuery, document, window);

/* Utils Fin */

/* Discounts Ini */

(function ($, doc, win, undefined) {
	oe.mod.flagsDiscount = oe.mod.flagsDiscount || {};

	oe.mod.flagsDiscount = {
		getPromoType: function (item) {
			var o = [],
				teasers = (item.sellers) ? item.sellers[0].commertialOffer.Teasers : [],
				self = this;

			"undefined" != typeof teasers && null != teasers &&
				$.each(teasers, function (a, p) {
					var parseNamePromo = self.objectToArray(p),
						getTypePromo = (parseNamePromo[2] && parseNamePromo[2]["<Parameters>k__BackingField"][0] ? parseNamePromo[2]["<Parameters>k__BackingField"][0]["<Name>k__BackingField"] : '');

					o.push({ type: getTypePromo });
				});

			return o;
		},

		objectToArray: function (obj) {
			var arr = [];
			for (var o in obj) {
				if (obj.hasOwnProperty(o)) {
					arr.push(obj[o]);
				}
			}
			return arr;
		},

		getListProducts: function () {
			oe.cache.products = oe.cache.products || {};

			var $prods = $('.product'),
				ids = [];

			$prods.each(function (i, t) {

				var $t = $(t),
					pID = $t.attr('data-id'),
					sku = $t.find('.buy-button-normal');

				// validar que exista en cache
				if (typeof oe.cache.products[pID] !== "undefined" && typeof oe.cache.products[pID].done !== "undefined") {
					// var t = oe.cache.products[pID];

					/* aplicar formatos a los productos */
					// oe.modules.flagsDiscount.productFormat(t);

				} else if (typeof pID != 'undefined' && pID != null) {
					ids.push(pID);
				}

				/* if ($t.find('.price-before').length != 0) {
					var nt = parseFloat($t.find('.price-before span').text().replace('S/. ', '').replace('S/ ', '').replace(',', '').trim());
					nt = oe.mod.utils.formatPrice(nt, ",", ".", 2, "");
					var g = nt.split(".");
					$t.find('.price-before span').html('<i>S/ </i>' + g[0] + '<sup>.' + g[1] + '</sup>');
				}
				if ($t.find('.price-after').length != 0) {
					var nt = parseFloat($t.find('.price-after span').text().replace('S/. ', '').replace('S/ ', '').replace(',', '').trim());
					nt = oe.mod.utils.formatPrice(nt, ",", ".", 2, "");
					var g = nt.split(".");
					$t.find('.price-after span').html('<i>S/ </i>' + g[0] + '<sup>.' + g[1] + '</sup>');
				}
				if ($t.find('.flag p.tag:hidden').length != 0) {
					var tagPercent = $t.find('.flag p.tag').text().replace('%', '').split(',');
					var porcentaje = parseFloat(tagPercent.join('.'));
					porcentaje = Math.round(porcentaje);
					if (tagPercent[0] > 0) {
						$t.find('.flag p.tag').text('-' + porcentaje + '%').show()
					}
				}

				if (!$t.find('.productName').hasClass('formated')) {
					var name = $t.find('.productName')
					oe.mod.utils.formatName($t.find('.productName'), 2)
					$(name).addClass('formated')
				} */
			});

			if (ids.length > 0) {

				/* if (isScrollInfinite) {
					var cant = ids.length;
					var intItems = Math.floor(cant / 18);
					var resto = cant % 18;

					if (intItems > 1) {
						if (resto == 0) {
							ids.splice(0, 18 * (intItems - 1));
						} else if (resto != 0) {
							ids.splice(0, 18 * (intItems));
						}

					} else if (intItems == 1) {
						if (resto != 0) {
							ids.splice(0, 18 * (intItems));
						}
					}
				} */

				var cantIds = ids.length,
					cont = 0,
					tmpIds = [];

				for (var i = 1; i <= ids.length; i++) {
					tmpIds.push(ids[i - 1]);
					cont++;

					if (i % 18 == 0) { //Se consulta de 18 en 18 en vtex
						oe.mod.flagsDiscount.getProductsInfo(tmpIds, 1, function (data) {
							// var product;

							for (var index = 0; index < data.length; index++) {
								var t = data[index];
								oe.cache.products[t.productId] = t;
								// oe.mod.flagsDiscount.productFormat(t);
							}
						});
						tmpIds = [];
					} else if (cont == cantIds && i % 18 != 0) { //lo que posiblemente quede (resto)
						oe.mod.flagsDiscount.getProductsInfo(tmpIds, 1, function (data) {
							// var product;

							for (var index = 0; index < data.length; index++) {
								var t = data[index];
								oe.cache.products[t.productId] = t;
								// oe.modules.flagsDiscount.productFormat(t);
							}
						});
						tmpIds = [];
					}
				}
			}
		},

		getProductsInfo: function (_productIdList, _salesChanel, _callback) {
			var salesChannel = _salesChanel.toString(),
				resultData = [],
				cleanList = [],
				productId;

			// Depura lista para que no tenga valores repetidos
			for (var index = 0; index < _productIdList.length; index++) {
				productId = parseFloat(_productIdList[index]);

				if (cleanList.indexOf(productId) === -1) {
					cleanList.push(productId);
				}
			}

			// Lista de SKU por URL
			var skuParameters = $.map(cleanList, function (productId) {
				return "productId%3A" + productId;
			}).join("%2C"),

				// Cantidad de items por consulta
				paginationLimit = 50,

				// Obtiene la cantidad de partes en las que se realizaran las consultas
				numberOfPages = Math.ceil(cleanList.length / paginationLimit),

				// Cadena de paginación
				pagingString,
				start,
				end,
				requestCounter = 0,
				ajaxUrl;

			for (var index = 0; index < numberOfPages; index++) {

				start = paginationLimit * index;
				end = (paginationLimit * (index + 1)) - 1;
				pagingString = '&_from=' + start + '&_to=' + end;

				// Crea las url Ajax
				ajaxUrl = '/api/catalog_system/pub/products/search?fq=' + skuParameters + pagingString + '&sc=' + salesChannel;

				$.ajax({
					url: ajaxUrl,
					async: false
				}).done(function (data) {
					requestCounter++;
					resultData = resultData.concat(data);

					if (requestCounter === numberOfPages) {
						_callback(resultData);
					}

				}).fail(function (jqXHR, textStatus, errorThrown) {
					_callback('error');
				});
			}
		},

		getPriceOh: function (prod) {
			var priceOh = 0;

			if (prod) {
				var item = prod.sellers.find(function (it) { return it.sellerName = "oechsle"; }),
					promo = (item && item.commertialOffer ? item.commertialOffer : null);

				if (promo) {
					var price = promo.Price,
						descOH = [],
						descMP = [],
						priceOh1 = 0,
						priceOh2 = 0;

					("undefined" != typeof promo.Teasers && null != promo.Teasers) && $(promo.Teasers).each(function (row, discount) {
						var namePromo = discount["<Name>k__BackingField"].toString().toLowerCase(),
							getDiscount = discount["<Effects>k__BackingField"]["<Parameters>k__BackingField"][0];

						if (getDiscount) {
							if (getDiscount["<Name>k__BackingField"] == "PercentualDiscount") {
								if (namePromo.indexOf("tarjeta oh!") >= 0) {
									priceOh1 = (price - (price * Number(getDiscount['<Value>k__BackingField']) / 100)).toFixed(2);
									descOH.push(Number(priceOh1));
								}
							}

							if (getDiscount["<Name>k__BackingField"] == "MaximumUnitPriceDiscount") {
								if (namePromo.indexOf("#maxprice") >= 0) {
									priceOh2 = Number(getDiscount['<Value>k__BackingField']) / 100;
									descMP.push(Number(priceOh2));
								}
							}

							if (getDiscount["<Name>k__BackingField"] == "PromotionalPriceTableItemsIds" || getDiscount["<Name>k__BackingField"] == "PromotionalPriceTableItemsDiscount") {
								if (namePromo.indexOf("#maxprice") >= 0) {
									getDiscount = discount["<Effects>k__BackingField"]["<Parameters>k__BackingField"][1];
									priceOh2 = (price - Number(getDiscount['<Value>k__BackingField'])).toFixed(2);
									descMP.push(Number(priceOh2));
								}
							}
						}
					});

					priceOh = (descMP.length || descOH.length ? Math.min.apply(null, descMP.concat(descOH)) : 0);
				}
			}

			return priceOh;
		}
	}

})(jQuery, document, window);

/* Discounts Fin */

/* Producto Sugerido Ini */

(function ($, doc, win, undefined) {
	oe.mod.productoSugerido = oe.mod.productoSugerido || {};

	oe.mod.productoSugerido.obtenerSugeridosIdProducto = function (pID) {
		return $.Deferred(function () {
			var def = this;

			oe.mod.utils.getProduct(pID).done(function (t) {
				var orden; //categoria, porcentaje,
				// var precio = t.items[0].sellers[0].commertialOffer.Price
				var filtrado = oe.mod.utils.objectSearch(oe.cache.menu, {
					id: t.categoryId
				})

				/* var brand = oe.mod.utils.objectSearch(oe.cache.brands, {
					name: t.brand
				}); */

				if ("undefined" != typeof filtrado && "undefined" != typeof filtrado.idCategoriaAgregaCompra && filtrado.idCategoriaAgregaCompra != "") {
					var query = 'C:' + filtrado.idCategoriaAgregaCompra;
				} else {
					var query = 'C:' + t.categoriesIds[0];
				}

				if ("undefined" != typeof filtrado && "undefined" != typeof filtrado.ordenadoAgregarCompraPor && filtrado.ordenadoAgregarCompraPor != "") {
					orden = filtrado.ordenadoAgregarCompraPor;
				} else {
					orden = 'OrderByTopSaleDESC';
				}

				oe.services.search.get(1, 'b86b62df-5f35-4035-be42-7ede59264b09', orden, 2, 1, 2, query).done(function (data) {
					def.resolve(data);
				})
			})
		}).promise();
	}

	oe.mod.productoSugerido.obtenerSugeridosMenuCat = function (pID) {
		return $.Deferred(function () {
			var def = this;

			oe.mod.utils.getProduct(pID).done(function (t) {
				var categoria, porcentaje, orden;
				var precio = t.items[0].sellers[0].commertialOffer.Price

				var filtrado = oe.mod.utils.objectSearch(oe.cache.menu, {
					id: t.categoryId
				})

				if ("undefined" != typeof oe.cache.brands) {
					var brand = oe.mod.utils.objectSearch(oe.cache.brands, {
						name: t.BrandId
					});
				}

				if ("undefined" != typeof filtrado && "undefined" != typeof filtrado.idCategoriaRelacionada && filtrado.idCategoriaRelacionada != "") {
					var query = 'C:' + filtrado.idCategoriaRelacionada;
				} else {
					//preguntar por la coleccion
					if ("undefined" != typeof filtrado.idColeccionRelacionada && filtrado.idColeccionRelacionada != "") {
						var query = 'H:' + filtrado.idColeccionRelacionada;
					} else {
						//Si no hay ninguna opción, se pone a la que pertenece el producto
						var query = 'C:' + t.categoriesIds[0];
					}
				}

				if ("undefined" != typeof filtrado && "undefined" != typeof filtrado.ordenadoRelacionadaPor && filtrado.ordenadoRelacionadaPor != "") {
					orden = filtrado.ordenadoRelacionadaPor;
				} else {
					orden = 'OrderByTopSaleDESC';
				}

				if ("undefined" != typeof filtrado && "undefined" != typeof filtrado.varPrecioRelacionadaPorcentual && filtrado.varPrecioRelacionadaPorcentual != "" && filtrado.varPrecioRelacionadaPorcentual != 0) {
					var porcentaje = filtrado.varPrecioRelacionadaPorcentual;
					query += '&fq=P:[' + (precio - (precio / 100) * porcentaje) + ' TO ' + (precio + (precio / 100) * porcentaje) + ']';
				}

				if ("undefined" != typeof filtrado && "undefined" != typeof filtrado.mismaMarca && filtrado.mismaMarca) {
					query += '&fq=B:' + brand
				}

				oe.services.search.get(1, 'b86b62df-5f35-4035-be42-7ede59264b09', orden, 12, 1, 12, query).done(function (data) {
					def.resolve(data);
				})
			})
		}).promise();
	}
})(jQuery, document, window);

/* Producto Sugerido Fin */

(function ($) {
	oe.mod.logistics = oe.mod.logistics || {};
	oe.mod.logistics.addSkuBigTicket = function (sku) {
		var d = new Date();
		var ramdom = d.getTime();
		var skus = [sku];
		var databtp = [];
		if (localStorage.getItem("bigTicketSku")) {
			databtp = JSON.parse(localStorage.getItem("bigTicketSku"));
		}
		if (databtp.indexOf(sku) == -1) {
			$.ajax({
				async: "true",
				crossDomain: true,
				url: "https://tienda.oechsle.pe/api-resource/?fn=checkBigTicket&v=" + ramdom,
				type: "POST",
				data: { skus },
				"cache-control": "no-cache",
				"Content-Type": "application/json",
				error: function (jqXHR, textStatus, errorThrown) {
					//console.log(jqXHR + "--" + textStatus + "--" + errorThrown);
				}
			})
				.done(function (response) {
					var respParse = JSON.parse(response);
					if (respParse.length > 0) {
						databtp.push(sku);
						localStorage.setItem("bigTicketSku", JSON.stringify(databtp));
					}
				});
		}
	}
})(jQuery);

/* Cart Ini */
(function ($, doc, win, undefined) {
	oe.mod.minicart = oe.mod.minicart || {};
	oe.mod.minicart.swModalServices = false;

	var opt = {
		btnCont: '.product',
		btnProdCont: js('pdp-prod-add'),
		btn: js('addtocart'),
		tooltipAttr: js('tooltip-attributes'),
		qty: '[name="qty"]',
		cartModal: '#pdpModalAddToCart',
		modalClose: '[modal-close]',
	}


	oe.mod.minicart.addToCart = function ($o) {
		var $p = $o.parents(opt.btnProdCont);
		$p = ($p.length ? $p : $o.parents(opt.btnCont));
		var href = $p.find('a[class^=buy-button]').attr('href');

		if (href.toLowerCase().indexOf('checkout') == -1) {
			if (href.toLowerCase().indexOf('alert') == -1) {
				window.location.href = href;

			} else {
				ttProdAdd($p);
			}
		} else {
			var q = (href.split("qty=")[1].split("&")[0], $p.find(opt.qty).val() || 1),
				s = href.split("seller=")[1].split("&")[0],
				sku = href.split("sku=")[1].split("&")[0],
				l = href.split("sc=")[1].split("&")[0],

				p = {
					id: sku,
					quantity: q,
					seller: s
				};

			//win.currentSku = r, s == i && (s = 1);

			/* if($p.is(opt.btnProdCont) && $pa.length) {
				if($pa.find('.item-dimension-Talla .input-dimension-Talla:checked').hasClass('item_unavailable')) {
					ttProdAdd($p);
					return ;
				}
			} */

			vtexjs.checkout.getOrderForm().done(function (orderForm) {
				var qtyItemsCart = 0,
					maxItemsCart = 25,
					i = 0,
					len = orderForm.items.length,
					sellerId = '1';

				for (i; i < len; i++) {
					qtyItemsCart = qtyItemsCart + orderForm.items[i].quantity;
					if (sku==orderForm.items[i].id) {
						sellerId = orderForm.items[i].seller;
					}
				}

				var emuQtyItemsCart = qtyItemsCart + parseInt(p.quantity);

				if (emuQtyItemsCart <= maxItemsCart) {
					vtexjs.checkout.addToCart([p], null, l).done(function (resp) {
						oe.mod.minicart.modalSuccess.init(sku, resp, sellerId);
						if (sellerId == '1') {
							oe.mod.logistics.addSkuBigTicket(sku);	
						}
						
						if (!oe.mod.minicart.swModalServices && $('body').is('.producto')) {
							var $sw = $.js('pdp-sw'),
								$swo = $sw.find('input:radio'),
								$sa = $.js('pdp-sa'),
								$sao = $sa.find('input:checkbox');

							oe.mod.minicart.productIndex = resp.items.findIndex(function (x) { return (x.id == sku); });
							oe.mod.minicart.productSku = sku;

							oe.mod.minicart.modalSuccess.services($sw, $swo, $sa, $sao);

							/* var val = $swo.filter(':checked').val();
							oe.mod.minicart.modalSuccess.services($sw, $swo, $sa, $sao);
							oe.mod.minicart.productIndex = resp.items.findIndex(function (x) { return (x.id == sku); });

							if (val) {

								var data = resp.items[oe.mod.minicart.productIndex].bundleItems.filter(itemsBl => {
									return itemsBl.name.indexOf('reparacion') == -1 && itemsBl.name.indexOf('reemplazo') == -1;
								})
								console.log("TEST", data);
								if (data.length == 0) {
									vtexjs.checkout.getOrderForm().then(function () {
										return vtexjs.checkout.addOffering(val, oe.mod.minicart.productIndex);
									}).done(function (orderForm) {
										$swo.filter(':checked').prop('checked', false);
										oe.mod.minicart.modalSuccess.init(sku, orderForm, sellerId);
									});
								} else {
									$swo.filter(':checked').prop('checked', false);
									oe.mod.minicart.modalSuccess.init(sku, orderForm, sellerId);
								}
							} else {
								oe.mod.minicart.modalSuccess.init(sku, resp, sellerId);
							} */
							/*
							oe.mod.minicart.productSku = sku;
							oe.mod.minicart.modalSuccess.services($sw, $swo, $sa, $sao);
							// oe.mod.minicart.addOffering(sku, resp);*/
            }
            if (SellerInfo.isValid(s)) {
              SellerInfo.loadStorageSeller(s);
            }
					});
				}
			});
		}
	}

	// Modal agregado al carro

	oe.mod.minicart.modalSuccess = {
		prices: function (sku, resp) {
			var // contador = 0,
				sum = (resp.items.length == 1 ? 1 : 2),
				$cm = $(opt.cartModal),
				$cmps = $cm.find(js('mcart-prods'));

			$cmps.html('');

			$.each(resp.items, function (i, it) {
				// contador += it.quantity; productId
				if (it.id == sku || ($.isArray(sku) && sku.indexOf(it.id) > -1)) {
					oe.mod.utils.getProduct(it.productId).done(function (t) {
						var $cmp = $cm.find(js('mcart-prod')).clone(),
						$pr = $cmp.find(js('mcart-price-regular')),
						$po = $cmp.find(js('mcart-price-online'));
						
						var sellerId = skuJson_0.skus[0].sellerId,
						isEcommerce = ECOMMERCES.includes(sellerId),
						productId = isEcommerce ? it.productId : it.id;
                        console.log("sellerIdsellerId:",sellerId)

						$cmp.find(js('mcart-quantity')).text(it.quantity);
						$cmp.find(js('mcart-sku')).text('SKU: ' + productId);
						$cmp.find(js('mcart-image')).attr('src', it.imageUrl);
						$cmp.find(js('mcart-brand')).text(it.additionalInfo.brandName);
						$cmp.find(js('mcart-name')).text(it.name);

						// Prices
						if (it.sellingPrice) {
							var item = oe.mod.utils.objectSearch(t, {
								itemId: sku
							});

							var pr = (it.listPrice / 100),
								$pt = $cmp.find(js('mcart-price-oh')),
								ptc = oe.mod.flagsDiscount.getPriceOh(item);

							// Si tengo precio con TarjetaOh
							if (ptc > 0) {
								var pth = $pt.html().replace('{{price}}', oe.mod.utils.formatPrice(ptc)),
									ptp = oe.helps.percentPrice(pr, ptc);

								pth = pth.replace('{{percent}}', '-' + ptp + '%');
								$pt.html(pth).removeClass('d-none');

							} else {
								$pt.remove();
							}

							if (it.listPrice > it.sellingPrice) {
								var prh = $pr.html().replace('{{price}}', oe.mod.utils.formatPrice(pr)),
									po = (it.sellingPrice / 100),
									poh = $po.html().replace('{{price}}', oe.mod.utils.formatPrice(po)),
									pop = oe.helps.percentPrice(pr, po);

								$pr.html(prh).removeClass('d-none');
								poh = poh.replace('{{percent}}', '-' + pop + '%');
								$po.html(poh).removeClass('d-none');

							} else {
								var poh = $po.html().replace('{{price}}', oe.mod.utils.formatPrice(pr));
								$po.html(poh).removeClass('d-none');
								$po.find(js('mcart-percent-online')).remove();
								$pr.remove();
							}
						} else {
							var poh = $po.html().replace('{{price}}', 'Gratis');
							$po.html(poh).removeClass('d-none');
							$po.find(js('mcart-percent-online')).remove();
							$pr.remove();
						}
						$cmps.append('<div class="item">' + $cmp.html() + '</div>');
						// oe.mod.minicart.modalSuccess.createBundleIte(it);
					});
				}
			});
		},

		createBundleItem: function (item, prodId, index, opt) {
			var $modalSuccess = this;

			if (item && item.id) {
				var name = item.name.replace(/\( [0-9]+ \)/g, ""),
					price = parseFloat(item.price / 100).toFixed(2),
					idOffering = item.id,

					html = '<div class="items_services">';
				html += '<div class="wp_servise">';
				html += '<div class="nombre_service">' + name + '</div>';
				html += '<div class="precio_service">S/ ' + price + ' </div>';
				html += '<div class="eliminar_service">';
				html += '<a href="javascript:;" data-js="js-remove_service" class="item-link-remove" data-sku="' + prodId + '" data-positioncart="' + index + '" data-idoffering="' + idOffering + '" data-option="' + opt + '">Eliminar</a>';
				html += '</div>';
				html += '</div>';
				html += '</div>';

				$.js('mcart-prods').after(html);

				$.js('js-remove_service').on('click', function () {
					var $this = $(this),
						idOffering = $this.data("idoffering"),
						positionCart = $this.data("positioncart"),
						tOpt = $this.attr('data-option');

					vtexjs.checkout.getOrderForm().then(function () {
						return vtexjs.checkout.removeOffering(idOffering, positionCart);
					}).done(function (orderForm) {
						var $sw = $.js('pdp-sw'),
							$swo = $sw.find('input:radio'),
							$sa = $.js('pdp-sa'),
							$sao = $sa.find('input:checkbox');

						if (tOpt == 1) {
							$swo.attr('checked', false)
								.attr('previousvalue', '');

						} else if (tOpt == 2) {
							$sao.attr('checked', false);
						}

						$modalSuccess.services($sw, $swo, $sa, $sao, tOpt);
						$this.closest('.items_services').remove();
					});
				});
			}
		},

		services: function ($sw, $swo, $sa, $sao, opt) {
			var opt = opt || null,
				$msw = $.js('mcart-sw'),
				$msa = $.js('mcart-sa'),
				mdo = js('modal-open'),
				$mds = $.js('mcart-serv'),
				aoSw1 = false,
				aoSw2 = false;

			if (!opt || opt == 1) {
				if ($swo.length) {
					if ($swo.is(':checked')) {
						aoSw1 = true;

					} else {
						swRadios();
					}

					function swRadios() {
						var $mswo;

						if (!$msw.html()) {
							var swHtml = $sw.children().html();

							$msw.html(swHtml);
							$mswo = $msw.find('input:radio');

							$mswo.each(function (i) {
								var $t = $(this),
									id = ($t.attr('id') + 's'),
									name = ($t.attr('name') + 's');

								$t.attr('id', id);
								$t.attr('name', name);
								$t.siblings('label').attr('for', id);
							});

							oe.mod.utils.servicesRadioEvent($msw);
							$msw.find(mdo).modal();

							$mswo.on('click', function () { eventRadio($swo, $(this)); });

						} else {
							$mswo = $msw.find('input:radio');
						}

						eventRadio($mswo, $swo);

						$mds.removeClass('d-none');
						$msw.removeClass('d-none');

						function eventRadio($rad, $rad2) {
							var preValAttr = 'previousValue',
								event = 'checked';

							setTimeout(function () {
								var val = $rad2.filter(':checked').val();

								$rad
									.attr(event, false)
									.attr(preValAttr, '');

								if (val) {
									$rad.filter('[value="' + val + '"]')
										.attr(event, true)
										.attr(preValAttr, event);

									oe.mod.minicart.addOffering($rad, oe.mod.minicart.productIndex)
										.done(function (resp, servId) {
											var swItem = resp.items[oe.mod.minicart.productIndex].bundleItems.find(x => x.id == servId);

											if (swItem && swItem.id) {
												oe.mod.minicart.modalSuccess.createBundleItem(swItem, oe.mod.minicart.productSku, oe.mod.minicart.productIndex, 1);
												$msw.addClass('d-none');
											}
										});
								}
							}, 200);
						}
					}
				}
			}

			if (!opt || opt == 2) {
				if ($sao.length) {
					if ($sao.is(':checked')) {
						aoSw2 = true;

					} else {
						swCheck();
					}

					function swCheck() {
						var $msao;

						if (!$msa.html()) {
							var checkAttr = 'checked';

							$msa.html($sa.clone().html());
							$msao = $msa.find('input:checkbox');

							$msao.each(function (i) {
								var $t = $(this),
									id = ($t.attr('id') + 's'),
									name = ($t.attr('name') + 's');

								$t.attr('id', id);
								$t.attr('name', name);
								$t.attr(checkAttr, $sa.find('input:checkbox').eq(i).is(':checked'));
								$t.siblings('label').attr('for', id);
							});
							$msa.find(mdo).modal();

							$msao.on('change', function () { eventCheck($sao, $(this)); });

							$msa.find('h2').addClass('text-primary');

						} else {
							$msao = $msa.find('input:checkbox');
						}

						eventCheck($msao, $sao);

						$mds.removeClass('d-none');
						$msa.removeClass('d-none');

						function eventCheck($check, $check2) {
							var checkAttr = 'checked';

							setTimeout(function () {
								var val = $check2.filter(':checked').val();

								$check
									.attr(checkAttr, false);

								if (val) {
									$check.filter('[value="' + val + '"]')
										.attr(checkAttr, true)

									oe.mod.minicart.addOffering($check, oe.mod.minicart.productIndex)
										.done(function (resp, servId) {
											var swItem = resp.items[oe.mod.minicart.productIndex].bundleItems.find(x => x.id == servId);

											if (swItem && swItem.id) {
												oe.mod.minicart.modalSuccess.createBundleItem(swItem, oe.mod.minicart.productSku, oe.mod.minicart.productIndex, 2);
												$msa.addClass('d-none');
											}
										});
								}
							}, 200);
						}
					}
				}
			}

			if (aoSw1 && aoSw2 || aoSw1) {
				swAddOfferingDone();

			} else if (aoSw2) {
				saAddOfferingDone();
			}

			function swAddOfferingDone() {
				oe.mod.minicart.addOffering($swo, oe.mod.minicart.productIndex)
					.done(function (resp, servId) {
						var swItem = resp.items[oe.mod.minicart.productIndex].bundleItems.find(x => x.id == servId);

						if (swItem && swItem.id) {
							oe.mod.minicart.modalSuccess.createBundleItem(swItem, oe.mod.minicart.productSku, oe.mod.minicart.productIndex, 1);
							$msw.addClass('d-none');

						} else {
							swRadios();
						}

						if (aoSw2) { saAddOfferingDone(); }
					})
					.fail(function () {
						if (aoSw2) { saAddOfferingDone(); }
					});
			}

			function saAddOfferingDone() {
				oe.mod.minicart.addOffering($sao, oe.mod.minicart.productIndex)
					.done(function (resp, servId) {
						var swItem = resp.items[oe.mod.minicart.productIndex].bundleItems.find(x => x.id == servId);

						if (swItem && swItem.id) {
							oe.mod.minicart.modalSuccess.createBundleItem(swItem, oe.mod.minicart.productSku, oe.mod.minicart.productIndex, 2);
							$msa.addClass('d-none');

						} else {
							swCheck();
						}
					});
			}
		},

		shippingFree: function (sku, resp, sellerId) {
			var $ms = $.js('mcart-ship'),
				total = 0,
				seller = sellerId;

			if ($ms.length && resp.items && resp.items.length) {
				$.each(resp.items, function (i, it) {
					if (it.seller === ECOMMERCES[2]) total += ((it.sellingPrice * it.quantity) / 100);
					if(sku === it.id) seller = it.seller;
				});
			}

			if (oe.helps.shippingFree(total) && sellerId === ECOMMERCES[2]) {
				$ms.removeClass('d-none');
			}
			seller !== ECOMMERCES[2] && $ms.addClass('d-none');
		},

		init: function (sku, resp, sellerId) {
			this.prices(sku, resp);
			this.shippingFree(sku, resp, sellerId);
			// ShowModal
			$(opt.cartModal).modal('show');
		}
	}

	oe.mod.minicart.events = function () {
		var $msc = $.js('ms-continue');

		$(document).on('tap click', opt.btn, function (e) {
			e.preventDefault();
			oe.mod.minicart.addToCart($(this));
		});

		$msc.on('tap click', function () {
			oe.mod.minicart.swModalServices = true;
			$(opt.btn).trigger('click');
		});
	}

	oe.mod.minicart.services = function ($sw, $swo, $sa, $sao) {
		var $msw = $.js('mcart-sw'),
			$msa = $.js('mcart-sa'),
			mdo = js('modal-open'),
			$mds = $.js('mcart-serv');

		if ($swo.length) {
			var $msao;

			if (!$msw.html()) {
				var swHtml = $sw.children().html();
				$msw.html(swHtml);
				$msao = $msw.find('input:radio'),
					checkAttr = 'checked';

				$msao.each(function (i) {
					var $t = $(this),
						id = ($t.attr('id') + 's'),
						name = ($t.attr('name') + 's');

					$t.attr('id', id);
					$t.attr('name', name);
					$t.siblings('label').attr('for', id);
				});

				oe.mod.utils.servicesRadioEvent($msw);
				$msw.find(mdo).modal();
				$msw.removeClass('d-none');

				$msao.on('change', function () {
					var $t = $(this),
						val = $t.val(),
						check = $t.is(':' + checkAttr);

					$swo.filter('[value="' + val + '"]').attr(checkAttr, check);
				});

			} else {
				$msao = $msw.find('input:radio');
			}

			var val = $sw.find('input[type="radio"]:checked').val();
			if (val) $msao.filter('[value="' + val + '"]').attr('checked', true);

			$mds.removeClass('d-none');
		}

		if ($sao.length) {
			$msa.html($sa.clone().html());
			var $msao = $msa.find('input:checkbox'),
				checkAttr = 'checked';

			$msao.each(function (i) {
				var $t = $(this),
					id = ($t.attr('id') + 's'),
					name = ($t.attr('name') + 's');

				$t.attr('id', id);
				$t.attr('name', name);
				$t.attr(checkAttr, $sa.find('input:checkbox').eq(i).is(':checked'));
				$t.siblings('label').attr('for', id);
			});
			$msa.find(mdo).modal();
			$msa.removeClass('d-none');

			$msao.on('change', function () {
				var $t = $(this),
					index = $t.index(),
					check = $t.is(':' + checkAttr);

				$sao.eq(index).attr(checkAttr, check);
			});

			$mds.removeClass('d-none');
		}
	}

	oe.mod.minicart.addOffering = function ($obj, index) {
		var dfd = jQuery.Deferred();

		if ($obj && $obj.length) {
			if ($obj.is(':checked')) {
				var sId = $obj.filter(':checked').val();

				vtexjs.checkout.getOrderForm()
					.then(function () {
						return vtexjs.checkout.addOffering(sId, index);
					})
					.done(function (orderForm) {
						dfd.resolve(orderForm, sId);
					})
					.fail(function (err) {
						dfd.reject(err);
					})
			}
		}

		return dfd.promise();
	}

	/*oe.mod.minicart.addOffering2 = function(sku, resp) {
		if(resp && resp.items && resp.items.length && sku) {
			var $sw = $.js('pdp-sw'),
			swo = 'input[name="servGar"]',
			$sa = $.js('pdp-sa'),
			sao = 'input[name="servRep"]';

			if($sw.find(swo).is(':checked')) {
				var sId = $sw.find(swo + ':checked').val();
				setService(sId);
			}

			if($sa.find(sao).is(':checked')) {
				var sId = $sa.find(sao + ':checked').val();
				setService(sId);
			}
		}

		function setService(sId) {
			var sId = (typeof sId == 'string'? parseInt(sId): sId),
			index = resp.items.findIndex(function(x) { return (x.id == sku); });

				if(index > -1 && sId) {
					vtexjs.checkout.addOffering(sId, index);
				}
		}
	}*/

	oe.mod.minicart.removeOffering = function ($obj, index) {
		if ($obj && $obj.length == 1) {
			var sId = $obj.val();
			vtexjs.checkout.removeOffering(sId, index);
		}
	}

	oe.mod.minicart.init = function () {
		oe.mod.minicart.events();
	}

	function ttProdAdd($o) {
		var $tlp = $o.find(opt.tooltipAttr),
			tlpActive = 'active';

		$tlp.addClass(tlpActive);
		setTimeout(function () {
			$tlp.removeClass(tlpActive);
		}, 3000);
	}

})(jQuery, document, window);

/* Cart Fin */

/* Productos Cross Selling Ini */

(function ($, doc, win, undefined) {
	oe.com.product = oe.com.product || {};
	var a_color = [];
	var a_productId = [];

	var MAX_CNT_SUGERIDOS = 10,
		url = window.location.href,
		SHELVE_TEMPLATE = (url.indexOf('qaoechsle') > -1 ? 'f7b59fcd-13ea-47fa-851c-ef8fe832f655': 'b165a0a4-7bbe-4d76-9696-9fe82afd329e'); //RD: 'b165a0a4-7bbe-4d76-9696-9fe82afd329e', QA: f7b59fcd-13ea-47fa-851c-ef8fe832f655;

	oe.com.product.Selling = function (pContent, pOption, skusInt, colorInt) {
		var pID = $('#___rc-p-id').val();
        //var pID = $('.skuReference').html()
        
		self = this;
		self.opt = {
			content: pContent,
			option: (pOption ? pOption : 1),
			pID: pID, //whoboughtalsobought
			color: colorInt, //whoboughtalsobought
			skusInt: skusInt
		}
		// unloadSuggestions();
	}

	oe.com.product.Selling.prototype = {
		create: function () {
			var self = this,
				pID = self.opt.pID,
				color = self.opt.color;

			oe.mod.utils.getProduct(pID).done(function (t) {
				//console.log("t:->", t)
				var sc = t.SugerenciaColeccion;
				//console.log("oe.mod.utils.getProduct sc:->", sc)

				if (sc) {
					//console.log("dentro del if sc:->", sc)
					self.loadSuggestions('H:' + sc[0], function () {
						self.reloadSuggestionsSlider();
					});

				} else {
					sc = self.opt.option;
					//console.log("dentro del else sc->", sc)
					/* 0. Para algoritmo por defecto (mejorado)
						 1. Quien compró también compró
						 2. Quien vio también compró
						 O ingrese colección", "1536"); */

					switch (sc) {
						case '0':
							var req1 = self.getSuggestions();
							//console.log("case 0")
							req1.done(function (suggestions) {
								if (!self.loadSuggestionsProductsList(suggestions)) {
									self.loadSuggestionsFromMenu()
								}
							})
							break;

						case '1': // Quien compró también compró
							var req2 = self.getSuggestionsWBAB();
							//console.log("req2:::", req2)
							//console.log("case 1")

							req2.done(function (suggestions) {
								self.loadSuggestionsProductsList(suggestions);
							})
							break;

						case '2': //Quien vio también compró
							var req3 = self.getSuggestionsWSAB();
							//console.log("case 2")

							req3.done(function (suggestions) {
								self.loadSuggestionsProductsList(suggestions);
							})
							break;

						case '3': //Quien vio también vio
							var req3 = self.getSuggestionsWSAS();
							//console.log("case 3")
							//console.log("self", self)
							//console.log("req3::",req3)

							req3.done(function (suggestions) {
								//console.log("suggestions 3:", suggestions)
								self.loadSuggestionsProductsList(suggestions);
							})
							break;

						case '4': //Accesorios
							var req4 = self.getSuggestionsWAC();
							//console.log("case 4")

							req4.done(function (suggestions) {
								self.loadSuggestionsProductsList(suggestions);
							})
							break;

						case '5':
							var req5 = self.getSuggestionsIntercorp();
							//console.log("case 5")
							//console.log("self", self)
							//console.log("req5::",req5)
							
							req5.then(function (suggestions) {
								//console.log("suggestions 5:", suggestions)
								//self.loadSuggestionsProductsList(suggestions);
								self.loadSuggestionsProductsList_int(suggestions, color);
							})
							$("#completar-compra").addClass("slider-int-prod")
							//document.querySelectorAll('div[data-id="1292705"] input[data-color="Rosado"] + label')[0].click()
							break;

						default:
							self.loadSuggestions('H:' + sc, function () {
								self.reloadSuggestionsSlider();
								//console.log("case default")
							});
					}
				}
			});
		},

		loadSuggestionsFromMenu: function () {
			var self = this,
				pID = self.opt.pID,
				sggMenu = oe.mod.productoSugerido.obtenerSugeridosMenuCat(pID);

			sggMenu.done(function (data) {
				var sugerido = $(data).find('.product.instock').not('[data-id="' + pID + '"]').not('[data-id="' + pID + '"]').parent();

				$('.relacionados-slider-cnt').find('ul.vitrina').append(sugerido);
				self.reloadSuggestionsSlider();
			});
		},

		loadSuggestionsProductsList: function (suggestions) {
			var self = this,
				items = '';
			if (suggestions.length > 0) {
				$.each(suggestions, function (i, t) {
					items += (i > 0 ? ',' : '') + 'productId:' + t.productId;
				})
				self.loadSuggestions(items, function () {
					self.reloadSuggestionsSlider();
				});
				return true;
			} else {
				return false;
			}
		},

		loadSuggestionsProductsList_int: function (suggestions, color) {
			var self = this,
				items = '',
				posicion_colores = Object.keys(suggestions),
				colors = self.opt.color,
				posicion_color_vtx = Object.keys(colors),
				list_color = [];
				
				for(var i=0;i<posicion_colores.length;i++){
					for(var j=0;j<posicion_color_vtx.length;j++){
						if(posicion_colores[i]==posicion_color_vtx[j]){
							list_color[i] = colors[j]
						}
					}
				}
				//console.log("list_color ::::",list_color)

			if (suggestions.length > 0) {
				$.each(suggestions, function (i, t) {
					//console.log("i", i)
					//console.log("t", t)
					if (t!== undefined) {
						var color_prod_int = colors[i]	
						var list_items = t.items
						//console.log("list_items: ",list_items)

						for(var i=0; i < t.items.length ; i++){
							SuprItemColor(color_prod_int)
						}
						
						function SuprItemColor(id){
							//console.log("SuprItemColor id: ", id)
							list_items.forEach(function(currentValue, i, arr){
								//console.log("currentValue", currentValue.id)
								//console.log("i", i)
								if(currentValue.id!==id){
									list_items.splice(i, i);     
								}
							})
						}
						items += (i > 0 ? ',' : '') + 'productId:' + t.productId;
						a_color.push(color_prod_int)
						a_productId.push(t.productId)
						//console.log("color_prod_int: ", color_prod_int)
					}
				})
				self.loadSuggestions(items, function () {
					self.reloadSuggestionsSlider_int();
				});
				
				console.log("a_color:", a_color)
				console.log("a_productId: ", a_productId)

				return true;
			} else {
				return false;
			}
		},

		loadSuggestions: function (collection, callback) {
			var self = this;

			oe.services.search.get(1, SHELVE_TEMPLATE, 'OrderByTopSaleDESC', MAX_CNT_SUGERIDOS, 1, MAX_CNT_SUGERIDOS, collection, false)
				.done(function (data) {
					var sugerido = $(data).find('.product.instock').parent(),
						$pcs = $.js(self.opt.content);

					$pcs.html('<ul class="vitrina"></ul>');
					$pcs.find('ul.vitrina').append(sugerido);
					callback(sugerido);
				})
		},

		getSuggestions: function () {
			return $.get("/api/catalog_system/pub/products/crossselling/suggestions/" + this.opt.pID);
		},

		getSuggestionsWBAB: function () {
			return $.get("/api/catalog_system/pub/products/crossselling/whoboughtalsobought/" + this.opt.pID);
		},

		getSuggestionsWSAB: function () {
			return $.get("/api/catalog_system/pub/products/crossselling/whosawalsobought/" + this.opt.pID);
		},

		getSuggestionsWSAS: function () {
			return $.get("/api/catalog_system/pub/products/crossselling/whosawalsosaw/" + this.opt.pID);
		},

		getSuggestionsWAC: function () {
			return $.get("/api/catalog_system/pub/products/crossselling/accessories/" + this.opt.pID);
		},

		getSuggestionsIntercorp: async function () {
			try {
				var list_sku = this.opt.skusInt;
				var jList = []
				var respTemp
				for(var i=0; i < list_sku.length ; i++){
					respTemp = await $.get("/api/catalog_system/pub/products/search?fq=skuId:" + list_sku[i])
					//console.log("jList[i]", jList[i])
                    if(respTemp[0] !== undefined){
						//jList.push(respTemp[0])
						jList[i] = respTemp[0]
                    }
				}
                //console.log("jList : ",jList)
				return jList
			} catch(e) {
				console.log(e);
			}
		},

		reloadSuggestionsSlider_int: function () {
			$.js(this.opt.content).find('ul.vitrina').slick({
				slidesToShow: 5,
				slidesToScroll: 2,
				centerPadding: '20px',
				arrows: true,
				infinite: true,
				dots: true,
				speed: 500,
				responsive: [{
					breakpoint: 992,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2,
						arrows: false,
						infinite: true,
					}
				},
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 4,
						infinite: true,
					}
				}]
			});

			oe.mod.flagsDiscount.getListProducts();
			oe.com.products.colorAttr();
			oe.helps.remDecimalPerc();
			oe.com.products.priceOh($.js(this.opt.content).find(js('plp-product')));

			for(var i=0; i < a_productId.length ; i++){
				$("#completar-compra .prod-attr[data-js='prod-attr-"+a_productId[i]+"']").attr("data-color", a_color[i])
				//console.log("lleno id")
				$("#completar-compra .vitrina .skuList[data-id='"+a_productId[i]+"']").find("input").removeAttr("checked")
				$("#completar-compra .vitrina .skuList[data-id='"+a_productId[i]+"']").find("label").removeClass("checked")
				$("#completar-compra .vitrina .skuList[data-id='"+a_productId[i]+"']").find("input[data-color='"+a_color[i]+"']").click()
				//console.log("list_color:",list_color )
			}
		},

		reloadSuggestionsSlider: function () {
			$.js(this.opt.content).find('ul.vitrina').slick({
				slidesToShow: 5,
				slidesToScroll: 2,
				centerPadding: '20px',
				arrows: true,
				infinite: true,
				dots: true,
				speed: 500,
				responsive: [{
					breakpoint: 992,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2,
						arrows: false,
						infinite: true,
					}
				},
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 4,
						infinite: true,
					}
				}]
			});

			oe.mod.flagsDiscount.getListProducts();
			oe.com.products.colorAttr();
			oe.helps.remDecimalPerc();
			oe.com.products.priceOh($.js(this.opt.content).find(js('plp-product')));
		}
	}

})(jQuery, document, window);

/* Productos Cross Selling Fin */

/* Productos Colores Atributo Ini  */

(function ($, doc, win, undefined) {
	oe.com.products = oe.com.products || {};
	oe.cache.products = oe.cache.products || [];
	var caCont = 'prod-attr-',
		caSel = 'pa-color',
		paData = [];

	oe.com.products.colorAttr = function () {
		processProducts(oe.cache.products);
		cargarColores();
	}

	function processProducts(vtexData) {
		if (vtexData !== (typeof "object")) {
			vtexData = Object.values(vtexData)
		}
		vtexData.forEach(function (product) {
			var mappedVariations = {},
				itemsArr = product.items,
				mySet = new Set();
			var cat = 0;
			if (product.categoriesIds.indexOf('/100/') > -1) {
				cat = 100;
			}
			itemsArr.forEach(function (item) {
				if (item.variations !== undefined) {
					item.variations.forEach(function (variation) {
						let value = item[variation][0]
						if (!mappedVariations.hasOwnProperty(variation)) {
							mySet.add(value);
							mappedVariations[variation] = [value];
						} else {
							if (!mySet.has(value)) {
								mappedVariations[variation].push(value);
								mySet.add(value);
							}
						}

						if (!mappedVariations.hasOwnProperty(value)) {
							mappedVariations[value] = []
						}
						item.variations.forEach(function (variation) {
							var otherValue = item[variation][0]
							if (otherValue !== value && otherValue !== null) {
								mappedVariations[value][otherValue] = {
									skuid: item.itemId,
									imagen: item.images[0].imageUrl,
									urlCheckout: item.sellers[0].addToCartLink,
									stockAvailability: item.sellers[0].commertialOffer.AvailableQuantity,
									ListPrice: item.sellers[0].commertialOffer.ListPrice,
									Price: item.sellers[0].commertialOffer.Price
								}
							} else if (cat == 100) {
								mappedVariations[value][otherValue] = {
									skuid: item.itemId,
									imagen: item.images[0].imageUrl,
									urlCheckout: item.sellers[0].addToCartLink,
									stockAvailability: item.sellers[0].commertialOffer.AvailableQuantity,
									ListPrice: item.sellers[0].commertialOffer.ListPrice,
									Price: item.sellers[0].commertialOffer.Price
								}
							}
						})
					});

					paData[product.productId] = mappedVariations;
				}
			});

		})
	}

	function cargarColores() {
		$(".product.instock").each(function () {
			var pID = $(this).data("id"),
				isAlreadyColored = $(this).data("colors"),
				productColorData = getProductColorData(pID);

			if (productColorData && !isAlreadyColored) {
				generateColorsItemsProduct($(this), productColorData);
				$(this).data("colors", "true");
			}
		});
		$.js(caSel).bind('change', changeColor);

		// boton de ver más colores 
		/*$('.dimension-Color.plus').click(function() {
			$('.more-colors.d-none').removeClass('d-none');
			$(this).hide();
		});*/
	}

	function getProductColorData(pID) {
		var productData = paData[pID];
		//console.log("productDataproductDataproductData :", productData)
		return (productData ? productData : null);
	}

	function generateColorsItemsProduct(productElement, data) {
		//Agregar Colores
		if (data['Color'] == null) return;

		var $t = $(productElement),
			pID = $t.attr('data-id'),
			plHtml = '',
			plHtmlCheck = '',
			skuId = $t.find('.productImage img').attr('alt');

		data['Color'].forEach(function (color, i) {
			var eName = 'pa-color-' + pID,
				eID = eName + '-' + i,
				len = data['Color'].length,
				check = 'checked';

			skuId = skuId.split('_')[0];

			if (len > 1) {
				var check = (Object.keys(data[color]).find(function (x) {
					return data[color][x].skuid == skuId
				}) ? 'checked' : '');
			}

			//quitamos la restriccion de colores en el carrusel solo para intercorp
			if ( !$(".slider-int-prod") ) {
				console.log("hacer esto")
				if (i == 4) {
					var link = $t.attr('data-link');
					plHtml += '<a href="' + link + '"><label class="dimension-Color plus"></label></a><div class="more-colors d-none">';
				}
			}

			if (check) {
				plHtmlCheck =
					'<input id="' + eID + '" type="radio" class="input-dimension-Color" name="' + eName + '" value="' + color + '" data-color="' + color + '" data-js="pa-color" ' + check + ' />' +
					'<label for="' + eID + '" class="dimension-Color ' + color.toLowerCase() + ' ' + check + '"></label>';

			} else {
				plHtml +=
					'<input id="' + eID + '" type="radio" class="input-dimension-Color" name="' + eName + '" value="' + color + '" data-color="' + color + '" data-js="pa-color" />' +
					'<label for="' + eID + '" class="dimension-Color ' + color.toLowerCase() + '"></label>';
			}
		});

		plHtml = plHtmlCheck + plHtml;

		if (data['Color'].length >= 4) {
			plHtml += '</div>';
		}

		$t.find(js(caCont + pID)).append(
			'<div class="mt-15">' +
			'<ul class="topic"><li class="skuList" data-id="' + pID + '">' + plHtml + '</li></ul>' +
			'</div>'
		);
		$t.find(js(caCont + pID)).find('input[checked]').each(function () {
			$(this).attr('checked', true);
			if ($(this).is(':checked')) {
				let color = $(this).data("color"),
				$prod = $(this).parents(js('plp-product')),
				link = ($prod.attr('data-link') + '?color=' + color);
				$prod.find('a[href]').attr('href', link);
			}
		});
	}

	function changeColor() {
		var $t = $(this),
			$p = $t.parent(),
			color = $t.data("color"),
			id = $p.data("id"),
			dataColor = paData[id][color],
			name = $t.attr('name'),
			ind = dataColor[Object.keys(dataColor)[0]],
			check = 'checked',

			//Frontend Handling

			imageDiv = $t.parents('.product').find(".productImage").children('img');

		$p.find('input[name="' + name + '"]').next('label').removeClass(check);
		$t.next('label').addClass(check);

		if (!imageDiv.attr("src").includes(ind.skuid)) {
			imageDiv.stop();

			imageDiv.attr("src", ind.imagen).on('load', function () {
				imageDiv.stop();
			})
		}

		var $prod = $t.parents(js('plp-product')),
			link = ($prod.attr('data-link') + '?color=' + color);

		$prod.find('a[href]').attr('href', link);
	}
})(jQuery, document, window);

/* Productos Colores Atributo Fin  */

/* Productos Precios Ini  */

(function ($) {
	oe.com.products.priceOh = function ($obj) {

		var prod = js('plp-product'),
			$prods = ($obj && $obj.length ? $obj : $(prod).not('.-toh'));

		$prods = $prods.not(".-toh");
		function init() {
			getPrice();
		};

		function getPrice() {
			var skus = getProductsSku();

			if (skus) {
				oe.services.search.getBy(skus).done(render);
			}
		}

		function commertialOffer(e) {
			if ("items" in ("string" == typeof e ? new String(e) : e)) {
				for (var t, a = e.items, s = 0; s < a.length; s++) {
					var o = a[s].sellers[0].commertialOffer;
					if (o.AvailableQuantity > 0 && o.Price > 0) {
						t = a[s];
						break
					}
				}
				return t
			}
		}

		function render(data) {

			if (data && data.length) {
				$.each(data, function (i, it) {

					var nIt = commertialOffer(it);

					if (typeof nIt != 'undefined') {
						var pID = it.productId,
							sku = (nIt.SKU && nIt.SKU[0] ? nIt.SKU[0] : nIt.itemId),
							item = oe.mod.utils.objectSearch(nIt, { itemId: pID });

						if (!item) {
							var sku = sku != '' ? sku : $('.product[data-id="' + pID + '"]').find('.productImage img').attr('alt');
							item = oe.mod.utils.objectSearch(nIt, { itemId: sku });
						}

						var $pt = $prods.filter('[data-id="' + pID + '"]').find(js('plp-price-oh'));

						if (item) {
							var pr = (item.sellers[0].commertialOffer.ListPrice),
								ptc = oe.mod.flagsDiscount.getPriceOh(item);

							var precioPenvio = parseFloat(item.sellers[0].commertialOffer.Price);
							var seller = item.sellers[0].sellerId;
							var $itemsprod = $prods.filter('[data-id="' + pID + '"]');
							var $tagEnvio = $itemsprod.find('.prod-tags');

							var pvl = 0;
							if (precioPenvio < ptc) {
								pvl = precioPenvio;							
							} else if (precioPenvio > ptc && ptc != 0) {
								pvl = ptc;							
							} else {
								pvl = precioPenvio;
							}

							if (oe.helps.shippingFree(pvl) && seller == "1" && !$tagEnvio.hasClass('envio_gratis')) {
								$tagEnvio.append('<p class="prod-tag"><img src="https://oechsle.vteximg.com.br/arquivos/oerd-envio-gratis.png" width="35" height="17" /></div>');
								$tagEnvio.removeClass('d-none');
								$tagEnvio.show();
								$tagEnvio.addClass('envio_gratis')
							}

							if (ptc > 0) {
								var pth = $pt.html().replace('{{price}}', oe.mod.utils.formatPrice(ptc)),
									ptp = oe.helps.percentPrice(pr, ptc);

								pth = pth.replace('{{percent}}', '-' + ptp + '%');
								$pt.html(pth).removeClass('d-none');
								$itemsprod.addClass('-toh');

							} else {
								$pt.remove();
							}
						} else {
							$pt.remove();
						}
					}
				});
			}
		}

		function getProductsSku() {
			var aSkus = [],
				skus = '?fq=',
				sw = false;

			$prods.each(function (i, it) {
				var sku = $(it).attr('data-id');

				if (aSkus.indexOf(sku) == -1) {
					skus += (i > 0 ? ',' : '') + 'productId:' + sku;
					aSkus.push(sku); //productId skuId
					sw = true;
				}
			});
			return (sw ? skus + '&_from=0&_to=49' : '');
		}



		init();
	}
})(jQuery);
/* Productos Precios Fin  */

(function ($) {
	oe.com.menu = function ($obj) {
		function init() {
			events();
		}

		function events() {
			$('.toggle-wrap').on('click', function () {
				$('.overlay-desktop').toggleClass('active');
				$('.overlay-menu').toggleClass('active');
				$('.mainmenu ul li').removeClass('active');
				$(this).toggleClass('active');
				$.js('section-1').addClass('active');
				if ($(window).width() >= 992) {
					if ($('body').hasClass('overflow-mnu')) {
						$('body').removeClass('overflow-mnu');
					} else {
						$('body').addClass('overflow-mnu');
					}
				}
			});

			$('.mainmenu').click(function (event) {
				event.stopPropagation();
			});

			$('.overlay-desktop').click(function (event) {
				event.stopPropagation();
				$('.toggle-wrap').removeClass('active', 2000);
				$('.overlay-desktop').removeClass('active');
				$('body').removeClass('overflow-mnu');
			});

			$('.overlay-menu').click(function () {
				//console.log('click');
				$('.toggle-wrap, .overlay-desktop, .overlay-menu').removeClass('active');
				$('body').removeClass('overflow-mnu');
			});

			$('#search-autocomplete-input').on('click', function () {
				$('.toggle-wrap').removeClass('active');
				$('.overlay-menu').removeClass('active');
				$('.overlay-desktop').removeClass('active');
			})


		}

		init();
	}

	oe.com.menu();

})(jQuery);

//Static Search
(function ($) {
	oe.mod.staticsearch = oe.mod.staticsearch || {};
	$.ajax({
		type: "GET",
		accept: 'application/vnd.vtex.ds.v10+json',
		contentType: 'application/json; charset=utf-8',
		url: '/files/OERD-static-search.json?v=' + (new Date().getTime()),
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown);
		},
		success: function (reponse) {
			if (reponse && reponse.filtros) {
				oe.mod.staticsearch = reponse.filtros
			}
		}
	});
})(jQuery);
//Static Search

//Buscador
(function ($) {
	oe.com.search = function ($obj) {
		function init() {
			events();
		}
		function events() {
			$.js('search').on('keyup', function (e) {
				var txt = $.trim($(this).val().replace(/\'|\"/, "").replace(/("|')/g, ""));
				//var leng = $(this).val().replace(/\'|\"/, "");
				var code = (e.keyCode ? e.keyCode : e.which);
				if (code == 13 && txt != "") {
					location.href = "/busca?ft=" + txt;
				}
				search(txt);
			});

			$('body').on('click', function (e) {
				$.js('results-search').hide().parent().removeClass('active');
			});

			$.js('search').on('click', function (e) {
				var result = $.js('results-search').text();
				if (result.length) {
					$.js('results-search').show().parent().addClass('active');
				}
				return false;
			});

			$.js('go-search').on('click', function (e) {
				e.preventDefault();
				var s = $.js('search').val();
				if (s != '') {
					search(s);
				}
			});
		}

		function staticsearch(s){
			var items = [];
			$.js('loading-search-allweb').show();
			$.js('text-search').text('"'+s+'"');
			$.js('search-allweb').attr('href',"/busca?ft=" + s);

			if (oe.mod.staticsearch.length > 0) {
				var staticsearch = oe.mod.staticsearch;
				for (var i = 0; i < staticsearch.length; i++) {
					let csearch = staticsearch[i].search.split("|");
					let rsearch = s.toString().toLowerCase();
					if (csearch.indexOf(rsearch) != -1) {
						items = staticsearch[i].items;
						break;
					}
				}
			}
			if (items.length > 0) {
				var htmlSs = '<ul class="items_resultsearch">';
				for (var i = 0; i < items.length; i++) {
					let productNameSs = items[i].nombre;
					let hrefSs = items[i].link;
					htmlSs += '<li class="item_resultsearch">' + '<a href="' + hrefSs + '">' + productNameSs + '</a>' + '</li>';
				}
				htmlSs += '</ul>';
				$.js('results-search').empty();
				$.js('results-search').append(htmlSs);
			}

			return items
		}

		function search(s) {
			if (s.length > 1) {				
				var items = staticsearch(s);
				var r = s.match(/^[a-n o-záéíóú \-]+$/i);

				$.ajax({
					url: '/buscaautocomplete/?maxRows=10&productNameContains=' + r + '&suggestionsStack=',
					headers: {
						"Accept": "application/vnd.vtex.ds.v10+json",
						"Content-Type": "application/json; charset=utf-8"
					},
					beforeSend: function beforeSend() {
						$.js('loading-search').show();
						$.js('results-search').hide().parent().removeClass('active');
					},
					complete: function complete() {
						$.js('loading-search').hide();
						$.js('results-search').show().parent().addClass('active');
					}
				}).done(function (data) {

					if (data.itemsReturned.length > 0) {
						var resutado = data.itemsReturned;
						//var search = decodeURIComponent(t).toLowerCase();
						var html = '<ul class="items_resultsearch">';
						for (var i = 0; i < resutado.length; i++) {
							//var patt = new RegExp(" " + search);
							var productName = resutado[i].name.replace("'", "").replace('"', '');
							var href = resutado[i].href;
							productName = productName.replace(s + "  ", "");
							var href = resutado[i].href;
							html += '<li class="item_resultsearch">' + '<a href="' + href + '">' + productName + '</a>' + '</li>'
							//console.log(productName);
						}
						html += '</ul>';
						items = staticsearch(s);
						if (!items.length > 0) {
							$.js('results-search').empty();
						}
						$.js('results-search').append(html);
					} else {
						var searchsku = s;

						$.ajax({
							url: '/api/catalog_system/pub/products/search?fq=skuId:' + searchsku,
							method: "GET",
							timeout: 0,
							headers: {
								"Accept": "application/vnd.vtex.ds.v10+json",
								"Content-Type": "application/json; charset=utf-8"
							},
							beforeSend: function beforeSend() {
								$.js('loading-search').show();
								$.js('results-search').hide().parent().removeClass('active');
							},
							complete: function complete() {
								$.js('loading-search').hide();
								$.js('results-search').show().parent().addClass('active');
							}
						}).done(function (datasku) {
							if (datasku.length > 0) {
								var resultadosku = datasku;
								//var search = decodeURIComponent(t).toLowerCase();
								var html = '<ul class="items_resultsearch">';
								//var patt = new RegExp(" " + search);
								var productName = resultadosku[0].productName.replace("'", "").replace('"', '');
								productName = productName.replace(s + "  ", "");
								var hrefsku = resultadosku[0].link;
								html += '<li class="item_resultsearch">' + '<a href="' + hrefsku + '">' + productName + '</a>' + '</li>'
								//console.log(productName);
								html += '</ul>';
								if (!items.length > 0) {
									$.js('results-search').empty();
								}
								$.js('results-search').append(html);
							} else {
								$.js('results-search').empty();							
								$.js('results-search').append('<span class="not_result">No se encontro resultado de la busqueda</span>');
							}
						});

					}
				});
			} else {
				$.js('results-search').empty();
				$.js('loading-search-allweb').hide();
				$.js('text-search').text('');
				$.js('results-search').hide().parent().removeClass('active');
			}
		}
		init();
	}

	oe.com.search();

})(jQuery);
//Buscador


//Suscribete
(function ($) {

	$.js('ft-dni').on('click', function (e) {
		$(this).removeClass('error');
	});

	$.js('ft-email').on('click', function (e) {
		$(this).removeClass('error');
	});

	$.js('js-ft-terms').on('change', function (e) {
		$(this).removeClass('error');
		$(this).parent().removeClass('error');
	});

	//popup suscribete
	var subscribed = getCookie('SUBSCRIBED_POPUP');
	if (subscribed != '1') {
		$('.popup-suscribete').removeClass('d-none').addClass('visible');
	}
	
	$(document).on('click','.popup-suscribete .ps-header', function(){
		$('.popup-suscribete .ft-box-newsletter').removeClass('d-none').addClass('d-block');
	});
	$(document).on('click','.popup-suscribete .ps-close', function(){
		$('.popup-suscribete').removeClass('visible').addClass('d-none');
	});

	function getCookie(cname) {
		var v = document.cookie.match('(^|;) ?' + cname + '=([^;]*)(;|$)');
		return v ? v[2] : null;
	}

	function setCookie(cname, cvalue, exdays) {
		var expires = "";
		cvalue = typeof cvalue == 'object' ? JSON.stringify(cvalue) : cvalue;

		if (!isNaN(exdays)) {
		    var d = new Date();
		    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		    expires = "expires=" + d.toGMTString() + ";";
		}

		document.cookie = cname + "=" + cvalue + "; " + expires + "path=/";
	}

	function deleteCookie(cname) {
		setCookie(cname, '', -1);
	}
	//End popup suscribete

	$.js('suscribete').on('click', function (e) {
		var $this = $(this),
			$form = $this.parent(),
			$inputNumeroDoc = $form.find(js('ft-dni')),
			$inputEmail = $form.find(js('ft-email')),
			$inputTermino = $form.find(js('js-ft-terms')),
			$inputForm = $form.find(js('ft-form'));

		var sw_error = 0;
		if ($inputNumeroDoc.val() == '') {
			$inputNumeroDoc.addClass('error');
			sw_error = 1;
		} else {
			$inputNumeroDoc.removeClass('error');
		}

		if ($inputEmail.val() == '') {
			$inputEmail.addClass('error');
			sw_error = 1;
		} else {
			$inputEmail.removeClass('error');
		}

		if (!$inputTermino.is(":checked")) {
			$inputTermino.parent().addClass('error');
			$inputTermino.addClass('error');
			sw_error = 1;
		} else {
			$inputTermino.parent().removeClass('error');
			$inputTermino.removeClass('error');
		}

		var exr = /^[0-9a-z_\-\.]+@[0-9a-z\-\.]+\.[a-z]{2,4}$/i;
		if (exr.test($inputEmail.val())) {
			$inputEmail.removeClass('error');
		} else {
			$inputEmail.addClass('error');
			sw_error = 1;
		}

		if ($inputForm.val() == '') {
			location.reload();
			return false;
		} 

		if (!sw_error) {
			var datos = {
				'correo': $inputEmail.val(),
				'documento': $inputNumeroDoc.val(),
				'form': $inputForm.val(),
			}
			$.ajax({
				type: "POST",
				accept: 'application/vnd.vtex.ds.v10+json',
				contentType: 'application/json; charset=utf-8',
				crossDomain: true,
				url: '//api.vtexcrm.com.br/oechsle/dataentities/NW/documents',
				data: JSON.stringify(datos),
				cache: false,
				beforeSend: function () {
					$this.text('Registrando..');
				},
				error: function (jqXHR, textStatus, errorThrown) {
					//alert(jqXHR + "--" + textStatus + "--" + errorThrown);
				},
				success: function (resp) {
					if (resp.Id != "") {

						if ($inputForm.val() == 'popup') {
							setCookie('SUBSCRIBED_POPUP', '1', 365);
							$('.popup-suscribete .ps-close').addClass('d-none');
							$('.popup-suscribete .ps-header').removeClass('d-block').addClass('d-none');
							$('.popup-suscribete .ft-box-newsletter').removeClass('d-block').addClass('d-none');
							$('.popup-suscribete .ps-message').removeClass('d-none').addClass('d-block');
							setTimeout(function(){
							  $('.popup-suscribete').fadeOut(3000);
							}, 5000);
						}

						$this.text('Suscrito!');

						setTimeout(function () {
							$this.text('Suscribirme');
						}, 3000);

						$inputNumeroDoc.val('');
						$inputEmail.val('');
						$form.find(js('js-ft-terms')).prop('checked', false);
					}
				}
			});
		}
	});

})(jQuery);
//Suscribete


//Menus
(function ($) {

	function sortJSON(data, key, orden) {
		return data.sort(function (a, b) {
			var x = a[key],
				y = b[key];

			if (orden === 'asc') {
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			}

			if (orden === 'desc') {
				return ((x > y) ? -1 : ((x < y) ? 1 : 0));
			}
		});
	}

	$.ajax({
		type: "GET",
		accept: 'application/vnd.vtex.ds.v10+json',
		contentType: 'application/json; charset=utf-8',
		url: '/files/OERD-menu.json?v=' + (new Date().getTime()),
		beforeSend: function () {
			//$('#nav').find('ul').remove();
		},
		error: function (jqXHR, textStatus, errorThrown) {
		},
		success: function (departamentos) {
			departamentos = sortJSON(departamentos, 'orden', 'asc')
			var html1 = '<ul class="d-lg-none"><li class="d-block d-lg-none"><a href="/"><i class="icon-rd-home"></i>Home</a></li></ul>';
			var html = '<ul>';

			departamentos.forEach(function (departamento, index) { //DEPARTAMENTOS
				if (departamento.visible) {
					var html_marca = '';
					if (index == 0) {
						html += '<li class="dropdown" data-js="section-1" data-open="#section-' + parseInt(index + 1) + '">';
					} else {
						html += '<li class="dropdown" data-js="menu-dropdown" data-open="#section-' + parseInt(index + 1) + '">';
					}

					html += '<a href="javascript:;"><i class="icon-rd-chevron-down"></i>' + departamento.name + '</a>';
					var len = departamento.children.length;
					var sw_marca = false;
					if (typeof departamento.marcas != 'undefined') {
						sw_marca = true;
					}
					if (len > 0) {
						html += '<ul class="section" id="section-' + parseInt(index + 1) + '">';
						html += '<li class="todo_departamento"><img src="/arquivos/' + departamento.icono + '" class="icono_dpto" alt=""/><span class="dpto-txt">' + departamento.name + '</span> <a href="' + departamento.url + '" class="link_todo">Ver todo</a></li>';
						if (sw_marca) html += '<div class="module-category">';
						departamento.children.forEach(function (categoria, indexC) { //CATEGORIAS
							if (categoria.visible) {
								var txtm = categoria.name.toLowerCase();
								if (txtm == 'marcas' ||
									txtm == 'marca' ||
									txtm.indexOf('marca') > -1 ||
									txtm.indexOf('marcas') > -1) {
									html_marca = 'category-brand';
								} else {
									html_marca = '';
								}
								html += '<li data-open="#category-' + parseInt(indexC + 1) + '"   class="' + html_marca + '" ><a href="' + categoria.url + '"><i class="icon-rd-chevron-down"></i>' + categoria.name + '</a>'
								var lensc = categoria.children.length;
								if (lensc > 0) {
									html += '<ul class="category" id="#category-' + parseInt(indexC + 1) + '" style="display:none;">';
									var vacio = true;
									var cantItems = 0
									categoria.children.forEach(function (subcategoria, indexSc) { //SUBCATEGORIAS
										if (subcategoria.visible ) { //&& cantItems <= 6

											if (subcategoria.name != '') {
												html += '<li><a href="' + subcategoria.url + '">' + subcategoria.name + '</a></li>';
												vacio = false;
												cantItems++;
											}

										}
									});
									if (!vacio) {
										html += '<li class="todo_categoria"><a href="' + categoria.url + '" class="link_todo">Ver todo ' + categoria.name + '</a></li>';
									}
									html += '</ul>';
								}
								html += '</li>';
							}
						});

						if (sw_marca) html += '</div>';

						if (sw_marca) {
							html += '<div class="module-brand">';
							html += '<li data-open="#brand-' + parseInt(index + 1) + '" ><a href="javascript:;"><i class="icon-rd-chevron-down"></i>' + departamento.tituloMarca + '</a>';
							html += '<ul class="category" id="brand-' + parseInt(index + 1) + '">';
							departamento.marcas.forEach(function (marca, indexM) {
								if (marca.visible) {
									html += '<li><a href="' + marca.url + '">' + marca.name + '</a></li>';
								}
							});
							html += '</ul>';
							html += '</div>';
						}
						html += '</ul>';
					}
					html += '</li>';
				}
			});
			html += '</ul>';


			/*$('#section-2 [data-open="#category-6"]').css("transform", `translateY(-370px)`);
			$('#section-2 [data-open="#category-7"]').css("transform", `translateY(-282px)`);
			$('#section-3 [data-open="#category-6"]').css("transform", `translateY(-112px)`);
			$('#section-4 [data-open="#category-7"]').css("transform", `translateY(-72px)`);
			$('#section-4 [data-open="#category-7"]').css("transform", `translateY(-72px)`);
			$('#section-4 [data-open="#category-9"]').css("transform", `translateY(-262px)`);
			$('#section-4 [data-open="#category-10"]').css("transform", `translateY(-212px)`);
			$('#section-4 [data-open="#category-11"]').css("transform", `translateY(-122px)`);
			$('#section-6 [data-open="#category-6"]').css("transform", `translateY(-142px)`);
			$('#section-6 [data-open="#category-7"]').css("transform", `translateY(-142px)`);
			$('#section-6 [data-open="#category-8"]').css("transform", `translateY(-112px)`);
			$('#section-6 [data-open="#category-9"]').css("transform", `translateY(-52px)`);
			$('#section-7 [data-open="#category-6"]').css("transform", `translateY(-252px)`);
			$('#section-7 [data-open="#category-7"]').css("transform", `translateY(-68px)`);
			$('#section-7 [data-open="#category-9"]').css("transform", `translateY(-268px)`);
			$('#section-7 [data-open="#category-10"]').css("transform", `translateY(-182px)`);
			$('#section-7 [data-open="#category-11"]').css("transform", `translateY(-222px)`);
			$('#section-8 [data-open="#category-6"]').css("transform", `translateY(-182px)`);
			$('#section-9 [data-open="#category-6"]').css("transform", `translateY(-82px)`);*/

			$('#nav').append(html);
			$('#nav').prepend(html1);

			if (isMobile()) {
				$('.mainmenu ul li a').click(function () {
					var $t = $(this),
						$p = $t.parent('li')
					open = $p.attr('data-open');
					if (open != undefined) {
						if (!$p.hasClass('open')) {
							$p.parent('ul').find('li.open').removeClass('open').find('ul').stop().slideUp();
							$p.addClass('open');
							$(open).stop().slideDown();
						} else {
							$p.removeClass('open');
							$(open).stop().slideUp();
						}
					} else {
						location.href = $t.attr('href');
					}
				});
			}
			$('.mainmenu ul li').on('mouseover', function () {
				var open = $(this).data('open');
				$('.mainmenu ul li').removeClass('active');
				$(this).addClass('active');
			});
			if (isMobile()) {
				$($.js('ft-menu-item')).click(function () {

					var elemento = $(this).attr('data-open');
					//console.log(elemento);
					$(elemento).toggle();

				});
				$('.section li > a').click(function (e) {
					e.preventDefault();
				})

				$($.js('search-mobile-active')).click(function () {
					$('.search-mobile').toggleClass('active');
					$('#header').toggleClass('active');
					$('body').toggleClass('active');
				});
				$('.search-mobile-overlay').click(function () {
					$('.search-mobile').removeClass('active');
					$('#header').removeClass('active');
					$('body').removeClass('active');
				});


			}
		}
	});
})(jQuery);
//Menus


(function ($) {
	function setSelectionRange(input, selectionStart) {
		input.focus();
		input.setSelectionRange(selectionStart, 0);
		}
		
		function setCaretToPos(input, pos) {
		setSelectionRange(input, pos, pos);
		}

	$(".search-mobile-toggle").click(function() {
		setCaretToPos($(".search-mobile #search-autocomplete-input")[0], 0);
		
	});

})(jQuery);


(function ($, FD) {
	//console.log(FD);

	function formartFechaString(fecha) {
		var fechaHora = fecha.split(' ');
		var fechaSplit = fechaHora[0].split('-')
		var fechaModificada = fechaSplit[2] + '-' + fechaSplit[1] + '-' + fechaSplit[0] + ' ' + fechaHora[1];
		return fechaModificada;
	}

	function parseDate(date) {
		const parsed = Date.parse(date);
		if (!isNaN(parsed)) {
			return parsed;
		}
		return Date.parse(date.replace(/-/g, '/').replace(/[a-z]+/gi, ' '));
	}

	function bannerActivo(fechaActual, fechaInicio, fechaFin) {
		var active = false;

		var fechaInicioParce = new Date();
		fechaInicioParce.setTime(parseDate(formartFechaString(fechaInicio)))

		var fechaFinParce = new Date();
		fechaFinParce.setTime(parseDate(formartFechaString(fechaFin)))

		if (fechaActual >= fechaInicioParce && fechaActual <= fechaFinParce) {
			active = true;
		}
		return active;
	}
	oe.mod.filtrojsonname = function (data, s) {
		const filtrojsonname = data.filter(d => d.name == s);
		return filtrojsonname;
	}
	oe.mod.filtrojsonid = function (data, s) {
		const filtrojsonid = data.filter(d => d.id == s);
		return filtrojsonid;
	}
	oe.mod.carrusel = function (wpImagen, section, banners, timer) {
		function htmlBanner(banner) {
			var target = banner.targetBlank ? 'target="_blank"' : '';
			var html = '<div title="' + banner.gtm + '" class="wp_img">';
			var link = banner.link_desktop;
			if (isMobile()) {
				link = banner.link_mobile;
			}
			html += '<a href="' + link + '" alt="' + banner.titulo + '" title="' + banner.titulo + '" ' + target + ' class="a_item gtm-item gtm_promotionClick" data-position="' + banner.gtm_data_position + '" data-id="' + banner.gtm_data_id + '" data-name="' + banner.titulo + '" data-seccion="' + banner.gtm_data_seccion + '" data-tipo="' + banner.gtm_data_tipo + '">';
			//html += '<img src="/arquivos/img_transparente.png" data-src="' + banner.img_mobile + '" data-srcset="' + banner.img_desktop + ' ' + MIN_DESKTOP + '" alt="' + banner.titulo + '" class="lazy" lazyload />';
			html += '<img src="' + banner.img_mobile + '" data-srcset="' + banner.img_desktop + ' ' + MIN_DESKTOP + '" alt="' + banner.titulo + '" class="lazy gtm_promotionView" lazyload data-id="' + banner.gtm_data_id + '" data-name="' + banner.titulo + '" data-seccion="' + banner.gtm_data_seccion + '" data-tipo="' + banner.gtm_data_tipo + '" data-position="' + banner.gtm_data_position + '" />';
			html += '</a>';
			html += '</div>';

			return html;
		}

		//FD.Utils.getServerTime(function (timer) {
		//FEHCA DEL SERVIDOR
		function parseDate(date) {
			const parsed = Date.parse(date);
			if (!isNaN(parsed)) {
				return parsed;
			}
			return Date.parse(date.replace(/-/g, '/').replace(/[a-z]+/gi, ' '));
		}
		var fechaServer = new Date(timer - 2 * 60 * 60 * 1000);
		var $wpImagen = $.js(wpImagen);
		console.log("wpimagen:" ,$wpImagen);
		var $section = $.js(section);

		var $imagenIzq = $section.find(js('imagen_lateral'));
		$imagenIzq.append(htmlBanner(banners.imagen_lateral[0]));
		if (typeof banners.imagen_lateral[0].ubicacion != '' && banners.imagen_lateral[0].ubicacion == 'der') {
			$section.addClass('img_der');
		} else if (typeof banners.imagen_lateral[0].ubicacion != '' && banners.imagen_lateral[0].ubicacion == 'izq') {
			$section.addClass('img_izq');
		} else {
			$section.addClass('img_der');
		}

		var $link_comprar_ahora = $section.find(js('link_comprar_ahora'));
		var $link_ver_todo = $section.find(js('link_ver_todo'));
		var $link_lo_mejor = $section.find(js('link_lo_mejor'));

		var link = banners.imagen_lateral[0].link_desktop;
		if (isMobile()) {
			link = banners.imagen_lateral[0].link_mobile;
		}

		$link_comprar_ahora.attr('href', link);
		$link_ver_todo.attr('href', banners.link_ver_todo);
		$link_lo_mejor.attr('href', banners.link_lo_mejor);

		if ($.js('ico_dpto').length > 0) {
			$.js('ico_dpto').attr("src", "/arquivos/" + banners.icono);
		}

		if (banners.imagenes_carrusel.length) {
			$.each(banners.imagenes_carrusel, function (index, banner) {
				if (banner.visible && bannerActivo(fechaServer, banner.inicio, banner.fin)) {
					$wpImagen.append(htmlBanner(banner));
				}
			});
			$('[lazyload]').i2bLazyLoad('ajax');
			console.log("antes del carrustel"+$wpImagen.selector)
			if($wpImagen.selector === "[data-js=imagenes_lo_hogar]"){
				$wpImagen.slick({
					dots: true,
					arrows: true,
					autoplay: false,
					autoplaySpeed: 2000,
					infinite: true,
					slidesToShow: 4,
					slidesToScroll: 1,
					fade: false,
					responsive: [
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 4,
								slidesToScroll: 1,
								arrows: false,
								infinite: true,
							}
						},
						{
							breakpoint: 680,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 1,
								arrows: false,
								infinite: true,
							}
						},
						{
							breakpoint: 400,
							settings: {
								centerMode: true,
								centerPadding: '60px',
								slidesToShow: 1,
								slidesToScroll: 1,
								arrows: false,
								infinite: true,
							}
						},
					]
				});
			} else {
				$wpImagen.slick({
					dots: true,
					arrows: true,
					autoplay: false,
					autoplaySpeed: 2000,
					infinite: true,
					slidesToShow: 2,
					slidesToScroll: 1,
					fade: false,
					responsive: [
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 4,
								slidesToScroll: 1,
								arrows: false,
								infinite: true,
							}
						},
						{
							breakpoint: 680,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 1,
								arrows: false,
								infinite: true,
							}
						},
						{
							breakpoint: 400,
							settings: {
								centerMode: true,
								centerPadding: '60px',
								slidesToShow: 1,
								slidesToScroll: 1,
								arrows: false,
								infinite: true,
							}
						},
					]
				});
			}
			

			$wpImagen.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
				//$('[lazyload]').i2bLazyLoad().loadImagen();
			});
		} else {
			$section.hide();
		}
		//});
	}
})(jQuery, Fizzmod);

(function ($, FD) {
	function removeSkuBigTicket (sku) {
		var databtp = [];
		var databtpTmp = [];
		if (localStorage.getItem("bigTicketSku")) {
			databtp = JSON.parse(localStorage.getItem("bigTicketSku"));
		}
		if (databtp.indexOf(sku) > -1) {
			for (var i = 0; i < databtp.length; i++) {
				if (databtp[i] != sku && databtp[i] != null && databtp[i] != "") {
					databtpTmp.push(databtp[i]);
				}
			}
			databtp = databtpTmp;
		}
		localStorage.setItem("bigTicketSku", JSON.stringify(databtp));
	}
	
	vtexjs.checkout.getOrderForm().done(function (orderForm) {		
		var items = orderForm.items;
		var databtp = [];
		if (localStorage.getItem("bigTicketSku")) {
			databtp = JSON.parse(localStorage.getItem("bigTicketSku"));
		}
		var sw = 0;
		if (items.length > 0 && databtp.length > 0 ) {
			$.each(databtp, function(i, e) {
				sw = 0;
				$.each(items, function (j, k) {					
					if (e == k.productId){
						sw = 1;
					}
				});
				if( sw == 0) {
					removeSkuBigTicket(e);
				}
			});
		} else if (items.length == 0) {
			localStorage.setItem("bigTicketSku", JSON.stringify([]));
		}
	});
})(jQuery, Fizzmod);
